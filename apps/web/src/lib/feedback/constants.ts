import { FeedbackType } from '@/lib/feedback/types';

export const FEEDBACK_PLACEHOLDERS: Record<FeedbackType, string> = {
  [FeedbackType.BUG_REPORT]:
    'Describe what went wrong and the steps to reproduce it. Include what you expected to happen vs. what actually happened.',
  [FeedbackType.FEATURE_REQUEST]:
    "Tell us about the feature you'd like to see. What problem would it solve? How would you use it?",
  [FeedbackType.GENERAL_FEEDBACK]:
    'Share your thoughts about your experience. What do you love? What could be better?',
  [FeedbackType.SUPPORT_ISSUE]:
    "Describe the issue you're facing. Include any error messages and what you were trying to do.",
};

export const FEEDBACK_TITLES: Record<FeedbackType, string> = {
  [FeedbackType.BUG_REPORT]: 'Bug report',
  [FeedbackType.FEATURE_REQUEST]: 'Feature request',
  [FeedbackType.GENERAL_FEEDBACK]: 'General feedback',
  [FeedbackType.SUPPORT_ISSUE]: 'Support issue',
};
