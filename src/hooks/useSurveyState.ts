import { useCallback, useMemo, useState } from 'react';

import type {
  ContactCallback,
  SharedSurveyProps,
  SurveyCallback,
  SurveyScreen
} from '../types';

interface UseSurveyStateProps {
  responseType?: SharedSurveyProps['responseType'];
  collectContact?: SharedSurveyProps['collectContact'];
  userId?: SharedSurveyProps['userId'];
  onScoreSubmit?: SurveyCallback;
  onFeedbackSubmit?: SurveyCallback;
  onContactSubmit?: ContactCallback;
}

const useSurveyState = ({
  responseType,
  collectContact,
  userId,
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

  const shouldCollectContact = Boolean(collectContact) && !userId;

  const screen = useMemo<SurveyScreen>(() => {
    if (isSuccess) {
      return 'success';
    }

    if (isAwaitingContact) {
      return 'contact';
    }

    if (typeof value === 'number') {
      return 'feedback';
    }

    return 'rating';
  }, [
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

        if (!responseType) {
          finishFlow();
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to submit'));
      } finally {
        setIsLoading(false);
      }
    } else if (!responseType) {
      finishFlow();
    }
  }, [
    responseType,
    onScoreSubmit,
    finishFlow
  ]);

  const onFeedbackChange = useCallback(async(text?: string | string[]) => {
    if (!text?.length) {
      finishFlow();
      return;
    }

    setError(null);
    const sendText = Array.isArray(text) ? text.join(';\n') : text;
    setText(sendText);

    if (onFeedbackSubmit) {
      setIsLoading(true);
      try {
        await onFeedbackSubmit({ value, text: sendText });
        finishFlow();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to submit'));
      } finally {
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
    setError(null);

    if (!email) {
      setIsSuccess(true);
      return;
    }

    if (onContactSubmit) {
      setIsLoading(true);
      try {
        await onContactSubmit({ value, text, email });
        setIsSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to submit'));
      } finally {
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
