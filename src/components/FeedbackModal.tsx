'use client';

import * as Sentry from '@sentry/nextjs';
import {
  IconCheck,
  IconChevronDown,
  IconExternalLink,
  IconInfoCircle,
  IconMessage,
} from '@tabler/icons-react';
import { ChangeEvent, useCallback, useState } from 'react';

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DISCORD_INVITE_URL } from '@/constants';
import { AnalyticEvent } from '@/lib/analytics';
import { trackClientEvent } from '@/lib/analytics/helpers';
import { FEEDBACK_PLACEHOLDERS, FEEDBACK_TITLES } from '@/lib/feedback/constants';
import { FeedbackRequestBody, FeedbackType } from '@/lib/feedback/types';
import { isEmptyString } from "@/lib/string";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const [feedback, setFeedback] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [canContact, setCanContact] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(FeedbackType.BUG_REPORT);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (isEmptyString(feedback) || isEmptyString(email)) {
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
            canContact,
            feedbackType,
            email,
          },
        }
      );

      try {
        const requestBody: FeedbackRequestBody = {
          email,
          feedback,
          feedback_type: feedbackType,
          can_contact: canContact,
        };
        const response = await fetch('/api/feedback', {
          method: 'POST',
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.warn('Failed to save feedback to database:', errorData.error);
        }
      } catch (dbError) {
        console.warn('Failed to save feedback to database:', dbError);
      }

      trackClientEvent(AnalyticEvent.ClickedSubmitFeedback, {
        type: feedbackType,
        canContact,
        email,
      });

      setFeedback('');
      setEmail('');
      setCanContact(false);
      setFeedbackType(FeedbackType.BUG_REPORT);
      setShowSuccess(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [feedback, email, canContact, feedbackType]);

  const handleFeedbackChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>): void => {
    setFeedback(e.target.value);
  }, []);

  const handleContactChange = useCallback((checked: boolean): void => {
    setCanContact(checked);
  }, []);

  const handleFeedbackTypeSelect = useCallback((option: FeedbackType): void => {
    setFeedbackType(option);
    setIsDropdownOpen(false);
  }, []);

  const handleDropdownOpenChange = useCallback((open: boolean): void => {
    setIsDropdownOpen(open);
  }, []);

  const handleSuccessClose = useCallback(() => {
    setShowSuccess(false);
    onClose();
  }, [onClose]);

  if (showSuccess) {
    // Show success dialog instead of main feedback form
    return (
      <Dialog open={true} onOpenChange={handleSuccessClose}>
        <DialogContent className="w-[90%] sm:w-sm sm:top-[60%] sm:translate-y-[-50%] top-auto bottom-4 translate-y-0 sm:bottom-auto">
          <DialogHeader className="mb-2">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full border border-muted-foreground/20 bg-[radial-gradient(circle_at_85%_85%,_#f0f9f0_0%,_transparent_100%)]">
                <IconCheck size={25} className="text-black" stroke={1.5} />
              </div>
            </div>

            <DialogTitle className="text-center text-2xl mb-3">
              Thanks for your feedback!
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-center m-auto text-base">
              Your feedback makes LEAP better. Hang out with us on Discord for updates, sneak peeks,
              and community builds.
              <a
                href={DISCORD_INVITE_URL}
                className="text-foreground font-bold inline-flex items-center gap-1 ml-1"
                target="blank"
              >
                Join the Discord <IconExternalLink size={16} />
              </a>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="w-full m-auto">
            <Button
              variant="outline"
              onClick={handleSuccessClose}
              className="w-full focus:bg-background! focus:border-muted! hover:text-background! m-auto"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] sm:w-md sm:top-[50%] sm:translate-y-[-50%] top-auto bottom-4 translate-y-0 sm:bottom-auto">
        <DialogHeader className="mb-2">
          {/* Icon */}
          <div className="flex justify-center mb-3">
            <div className="flex items-center justify-center w-16 h-16 rounded-full border border-muted-foreground/20 bg-[radial-gradient(circle_at_85%_85%,_#F3EEF8_0%,_transparent_100%)]">
              <IconMessage size={25} className="text-black" stroke={1.5} />
            </div>
          </div>

          <DialogTitle className="text-center text-2xl font-bold">
            Tell us what you think!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center m-auto text-sm">
            Have a request, issue, or idea? <br /> Your feedback shapes what we build next.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-6">
          {/* Type of request dropdown */}
          <div className="space-y-4">
            <label className="block text-base font-bold text-foreground mb-2">
              Type of request
            </label>
            <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
              <DropdownMenuTrigger asChild>
                <button className="w-full px-2 py-1 bg-background border border-muted-forground rounded-md text-base text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent focus:border-transparent flex items-center justify-between">
                  <span>{FEEDBACK_TITLES[feedbackType]}</span>
                  <IconChevronDown size={16} className="text-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}
                className="-tracking-[0.3px] px-2 py-1"
              >
                {Object.values(FeedbackType).map((feedbackType) => (
                  <DropdownMenuItem
                    key={feedbackType}
                    onSelect={() => handleFeedbackTypeSelect(feedbackType)}
                    className="cursor-pointer rounded-md px-2 py-1 transition-colors"
                  >
                    <p className="text-foreground text-base">{FEEDBACK_TITLES[feedbackType]}</p>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Feedback textarea */}
            <div className="flex items-center gap-1 mb-2">
              <label className="block text-base font-bold text-foreground">How can we help?</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconInfoCircle size={16} className="text-foreground my-auto" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm text-white">{FEEDBACK_PLACEHOLDERS[feedbackType]}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Textarea
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder={FEEDBACK_PLACEHOLDERS[feedbackType]}
              rows={5}
              className="resize-none overflow-y-auto max-h-40 min-h-30 text-base! focus:outline-none focus:ring-1! focus:ring-accent! focus:border-transparent"
            />

            <div className="mt-4">
              <label className="block text-base font-bold text-foreground mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 bg-background border border-muted-foreground rounded-md text-base text-foreground focus:outline-none focus:ring-1 focus:ring-accent focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 items-center mt-2">
            <Checkbox
              id="contact-consent"
              checked={canContact}
              onCheckedChange={handleContactChange}
            />
            <p className="text-foreground text-base">Leap can contact me about this feedback</p>
          </div>
        </div>

        <DialogFooter>
          <div className="flex flex-row gap-4 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={!feedback.trim() || !email.trim() || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
