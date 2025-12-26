import { useCallback, useMemo, useState } from 'react';

import type {
  SharedSurveyProps,
  SurveyCallback,
  SurveyScreen
} from '../types';

interface UseSurveyStateProps {
  responseType?: SharedSurveyProps['responseType'];
  onScoreSubmit?: SurveyCallback;
  onFeedbackSubmit?: SurveyCallback;
}

const useSurveyState = ({
  responseType,
  onScoreSubmit,
  onFeedbackSubmit
}: UseSurveyStateProps) => {
  const [value, setValue] = useState<number | undefined>();
  const [error, setError] = useState<Error | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const screen = useMemo<SurveyScreen>(() => {
    if (isSuccess) {
      return 'success';
    }

    if (typeof value === 'number') {
      return 'feedback';
    }

    return 'rating';
  }, [
    value,
    isSuccess
  ]);

  const onScoreChange = useCallback(async (newValue: number) => {
    setValue(newValue);
    setError(null);

    if (onScoreSubmit) {
      setIsLoading(true);
      try {
        await onScoreSubmit({ value: newValue });
        setIsSuccess(!responseType);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to submit'));
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsSuccess(!responseType);
    }
  }, [
    responseType,
    onScoreSubmit
  ]);

  const onFeedbackChange = useCallback(async(text: string | string[]) => {
    if (!text?.length) {
      return;
    }

    setError(null);
    const sendText = Array.isArray(text) ? text.join(';\n') : text;

    if (onFeedbackSubmit) {
      setIsLoading(true);
      try {
        await onFeedbackSubmit({ value, text: sendText });
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
    onFeedbackSubmit
  ]);

  return {
    error,
    value,
    screen,
    isLoading,
    isSuccess,
    onScoreChange,
    onFeedbackChange
  };
};

export default useSurveyState;
