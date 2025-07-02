'use client';

import { isEmptyString } from '@liquidai/leap-lib/utils';
import * as Sentry from '@sentry/nextjs';
import React, { ChangeEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const [feedback, setFeedback] = useState('');
  const [canContact, setCanContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isEmptyString(feedback.trim())) {
      return;
    }

    setIsSubmitting(true);
    try {
      Sentry.captureFeedback(
        {
          message: feedback,
          url: window.location.href,
        },
        {
          data: {
            canContact: canContact,
          },
        }
      );

      setFeedback('');
      setCanContact(false);
      onClose();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedbackChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleContactChange = (checked: boolean) => {
    setCanContact(checked);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            We are actively iterating on this edge AI platform. Any feedback or feature request is
            welcome.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Textarea
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Share your feedback or feature request..."
              rows={7}
              className="resize-none"
            />
          </div>

          <div className="flex gap-2 items-center">
            <Checkbox
              id="contact-consent"
              checked={canContact}
              onCheckedChange={handleContactChange}
            />
            <p>Liquid can contact me about this feedback</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} size="small">
            Cancel
          </Button>
          <Button onClick={handleSubmit} size="small" disabled={!feedback.trim() || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
