import { useCallback, useMemo, useState } from 'react';

import type {
  SharedSurveyProps,
  SurveyCallback
} from '../types';

const useSurveyState = (
  feedbackType?: SharedSurveyProps['feedbackType'],
  onSubmit?: SurveyCallback
) => {

  const [value, setValue] = useState<number | undefined>();
  const [error, setError] = useState<Error | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const screen = useMemo<'main' | 'success' | 'feedback'>(() => {
    if (isSuccess) {
      return 'success';
    }

    if (typeof value === 'number') {
      return 'feedback';
    }

    return 'main';
  }, [
    value,
    isSuccess
  ]);

  const onScoreChange = useCallback(async (newValue: number) => {
    setValue(newValue);
    setError(null);

    if (onSubmit) {
      setIsLoading(true);
      try {
        await onSubmit({ value: newValue });
        setIsSuccess(feedbackType === 'none');
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to submit'));
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsSuccess(feedbackType === 'none');
    }
  }, [feedbackType, onSubmit]);

  const onFeedbackChange = useCallback(async(comment: string | string[]) => {
    if (!comment?.length) {
      return;
    }

    setError(null);
    const sendComment = Array.isArray(comment) ? comment.join(';\n') : comment;

    if (onSubmit) {
      setIsLoading(true);
      try {
        await onSubmit({ value, comment: sendComment });
        setIsSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to submit'));
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsSuccess(true);
    }
  }, [value, onSubmit]);

  return {
    error,
    value,
    screen,
    isLoading,
    isSuccess,
    onFeedbackChange,
    onScoreChange
  };
};

export default useSurveyState;
