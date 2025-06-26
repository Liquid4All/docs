'use client';

import { ReactNode, useState } from 'react';

import { FeedbackModal } from '@/components/FeedbackModal';

interface FeedbackButtonProps {
  label: ReactNode;
  className?: string;
}

const FeedbackButton = ({ label, className }: FeedbackButtonProps) => {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setFeedbackModalOpen(true)} className={className}>
        {label}
      </button>

      <FeedbackModal isOpen={feedbackModalOpen} onClose={() => setFeedbackModalOpen(false)} />
    </>
  );
};

export default FeedbackButton;
