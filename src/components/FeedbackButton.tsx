'use client';

import { ReactNode, useCallback, useState } from 'react';

import { FeedbackModal } from '@/components/FeedbackModal';
import { Button, ButtonProps } from '@/components/ui/button';
import { AnalyticEvent } from '@/lib/analytics';
import { trackClientEvent } from '@/lib/analytics/helpers';
import { cn } from '@/lib/utils';

interface FeedbackButtonProps {
  label: ReactNode;
  className?: string;
  variant?: 'outline' | 'link';
  size?: ButtonProps['size'];
}

const FeedbackButton = ({
  label,
  className,
  variant = 'link',
  size = 'sm',
}: FeedbackButtonProps) => {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);

  const toggleFeedbackModal = useCallback(() => {
    setFeedbackModalOpen((prev) => !prev);
    trackClientEvent(AnalyticEvent.OpenedFeedbackModal);
  }, []);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={toggleFeedbackModal}
        className={cn('cursor-pointer', className)}
      >
        {label}
      </Button>

      <FeedbackModal isOpen={feedbackModalOpen} onClose={toggleFeedbackModal} />
    </>
  );
};

export default FeedbackButton;
