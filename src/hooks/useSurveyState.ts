import { useCallback, useMemo, useState } from 'react';

import type {
  SharedSurveyProps,
  SurveyCallback,
  SurveyScreen
} from '../types';

interface UseSurveyStateProps {
  feedbackType?: SharedSurveyProps['feedbackType'];
  onScoreSubmit?: SurveyCallback;
  onFeedbackSubmit?: SurveyCallback;
}

const useSurveyState = ({
  feedbackType,
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

    return 'main';
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
        setIsSuccess(feedbackType === 'none');
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to submit'));
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsSuccess(feedbackType === 'none');
    }
  }, [feedbackType, onScoreSubmit]);

  const onFeedbackChange = useCallback(async(comment: string | string[]) => {
    if (!comment?.length) {
      return;
    }

    setError(null);
    const sendComment = Array.isArray(comment) ? comment.join(';\n') : comment;

    if (onFeedbackSubmit) {
      setIsLoading(true);
      try {
        await onFeedbackSubmit({ value, comment: sendComment });
        setIsSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to submit'));
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsSuccess(true);
    }
  }, [value, onFeedbackSubmit]);

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
