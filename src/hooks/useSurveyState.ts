import { useCallback, useMemo, useRef, useState } from 'react';

import type {
  ContactCallback,
  SharedSurveyProps,
  SurveyAttachment,
  SurveyCallback,
  SurveyScreen
} from '../types';

interface UseSurveyStateProps {
  responseType?: SharedSurveyProps['responseType'];
  collectContact?: SharedSurveyProps['collectContact'];
  userId?: SharedSurveyProps['userId'];
  /** Whether the survey has a rating screen to show before feedback. @default true */
  hasRating?: boolean;
  onScoreSubmit?: SurveyCallback;
  onFeedbackSubmit?: SurveyCallback;
  onContactSubmit?: ContactCallback;
}

const useSurveyState = ({
  responseType,
  collectContact,
  userId,
  hasRating = true,
  onScoreSubmit,
  onFeedbackSubmit,
  onContactSubmit
}: UseSurveyStateProps) => {
  const [value, setValue] = useState<number | undefined>();
  const [text, setText] = useState<string | string[] | undefined>();
  const [error, setError] = useState<Error | null>(null);

  const [isAwaitingContact, setIsAwaitingContact] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isSubmittingRef = useRef(false);

  const shouldCollectContact = Boolean(collectContact) && !userId;

  const screen = useMemo<SurveyScreen>(() => {
    if (isSuccess) {
      return 'success';
    }

    if (isAwaitingContact) {
      return 'contact';
    }

    // With no follow-up step (`responseType` falsy), there's nothing to show after the rating
    // screen but the rating screen itself — the flow moves straight to contact/success instead.
    if (responseType && (!hasRating || typeof value === 'number')) {
      return 'feedback';
    }

    return 'rating';
  }, [
    responseType,
    hasRating,
    value,
    isAwaitingContact,
    isSuccess
  ]);

  const finishFlow = useCallback(() => {
    if (shouldCollectContact) {
      setIsAwaitingContact(true);
    } else {
      setIsSuccess(true);
    }
  }, [shouldCollectContact]);

  const onScoreChange = useCallback(async (newValue: number) => {
    setValue(newValue);
    setError(null);

    if (onScoreSubmit) {
      setIsLoading(true);
      try {
        await onScoreSubmit({ value: newValue });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to submit'));
      } finally {
        setIsLoading(false);

        // A rejected onScoreSubmit must not strand a rating-only survey on the rating screen.
        if (!responseType) {
          finishFlow();
        }
      }
    } else if (!responseType) {
      finishFlow();
    }
  }, [
    responseType,
    onScoreSubmit,
    finishFlow
  ]);

  const onFeedbackChange = useCallback(async (text?: string | string[], attachments?: SurveyAttachment[]) => {
    if (isSubmittingRef.current) {
      return;
    }

    if (!text?.length && !attachments?.length) {
      finishFlow();
      return;
    }

    setError(null);
    setText(text);

    if (onFeedbackSubmit) {
      isSubmittingRef.current = true;
      setIsLoading(true);
      try {
        await onFeedbackSubmit({ value, text, attachments });
        finishFlow();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to submit'));
      } finally {
        isSubmittingRef.current = false;
        setIsLoading(false);
      }
    } else {
      finishFlow();
    }
  }, [
    value,
    onFeedbackSubmit,
    finishFlow
  ]);

  const onContactChange = useCallback(async (email?: string) => {
    if (isSubmittingRef.current) {
      return;
    }

    setError(null);

    if (!email) {
      setIsSuccess(true);
      return;
    }

    if (onContactSubmit) {
      isSubmittingRef.current = true;
      setIsLoading(true);
      try {
        await onContactSubmit({ value, text, email });
        setIsSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to submit'));
      } finally {
        isSubmittingRef.current = false;
        setIsLoading(false);
      }
    } else {
      setIsSuccess(true);
    }
  }, [
    value,
    text,
    onContactSubmit
  ]);

  return {
    error,
    value,
    screen,
    isLoading,
    isSuccess,
    onScoreChange,
    onFeedbackChange,
    onContactChange
  };
};

export default useSurveyState;
