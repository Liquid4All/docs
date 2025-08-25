export enum FeedbackType {
  BUG_REPORT = 'bug_report',
  FEATURE_REQUEST = 'feature_request',
  GENERAL_FEEDBACK = 'general_feedback',
  SUPPORT_ISSUE = 'support_issue',
}

export interface FeedbackRequestBody {
  email: string;
  feedback: string;
  feedback_type: FeedbackType;
  can_contact: boolean;
}
