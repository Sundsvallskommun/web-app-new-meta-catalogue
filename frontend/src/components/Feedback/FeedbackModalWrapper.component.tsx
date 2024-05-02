import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
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

  const setQueryParam = (type: string) => {
    router.push(
      {
        pathname: router.pathname,
        query: type ? { feedback: type } : '',
      },
      undefined,
      { scroll: false }
    );
  };

  /** Control open or not by feedback query parameter */
  const handleModalClose = () => {
    setIsOpen(false);
    const params = new URLSearchParams(window.location.search);
    params.delete('feedback');
    const queryString = params.toString();
    const path = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;
    router.push(path, undefined, { scroll: false, shallow: true });
  };

  /** Control open or not by feedback query parameter */
  useEffect(() => {
    setFeedbackType(router.query.feedback ? (router.query.feedback as FeedbackDto['type']) : '');
    if (router.query.feedback) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [router.query]);

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
