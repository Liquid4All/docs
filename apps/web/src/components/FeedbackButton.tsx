'use client';

import { track } from '@vercel/analytics';
import { ReactNode, useCallback, useState } from 'react';

import { FeedbackModal } from '@/components/FeedbackModal';
import { Button } from '@/components/ui/button';
import { AnalyticEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface FeedbackButtonProps {
  label: ReactNode;
  className?: string;
}

const FeedbackButton = ({ label, className }: FeedbackButtonProps) => {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);

  const toggleFeedbackModal = useCallback(() => {
    setFeedbackModalOpen((prev) => !prev);
    track(AnalyticEvent.OpenedFeedbackModal);
  }, []);

  return (
    <>
      <Button variant="ghost" onClick={toggleFeedbackModal} className={cn('px-0', className)}>
        {label}
      </Button>

      <FeedbackModal isOpen={feedbackModalOpen} onClose={toggleFeedbackModal} />
    </>
  );
};

export default FeedbackButton;
