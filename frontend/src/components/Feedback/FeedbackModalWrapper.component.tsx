import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFeedbackHref } from '@utils/use-feedback-href.hook';
import { FeedbackModal } from './FeedbackModal.component';
import { FeedbackDto } from '@data-contracts/backend/data-contracts';
import { feedbackSelectTypes } from '@services/feedback-service';

interface FeedbackModalWrapperProps {
  type?: FeedbackDto['type'];
  open?: boolean;
}

export const FeedbackModalWrapper = ({ type = '', open = false }: FeedbackModalWrapperProps) => {
  const [isOpen, setIsOpen] = useState(open);
  const [feedbackType, setFeedbackType] = useState(type);

  const router = useRouter();
  const pathname = usePathname();
  const feedback = useSearchParams().get('feedback');
  const feedbackHref = useFeedbackHref();

  const setQueryParam = (type: string) => {
    router.push(type ? `${pathname}?feedback=${type}` : pathname, { scroll: false });
  };

  /** Control open or not by feedback query parameter */
  const handleModalClose = () => {
    setIsOpen(false);
    router.replace(feedbackHref());
  };

  /** Control open or not by feedback query parameter */
  useEffect(() => {
    setFeedbackType(feedback ? (feedback as FeedbackDto['type']) : '');
    if (feedback) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [feedback]);

  useEffect(() => {
    if (open) {
      setQueryParam(type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <FeedbackModal
      formData={{
        body: '',
        type: feedbackType,
        typeLabel: feedbackType ? feedbackSelectTypes.find((x) => x.type).label : undefined,
      }}
      isOpen={isOpen}
      closeModal={handleModalClose}
    />
  );
};
