import LeadButtons from '@layouts/ButtonGroup/LeadButtons';
import { Button } from '@sk-web-gui/react';
import Modal from './Modal.component';

export const ConfirmModal: React.FC<{
  title: string;
  message: string | JSX.Element;
  handleCancel;
  handleOk;
  onClose: () => void;
  className?;
}> = ({ title, message, className, handleCancel, handleOk, onClose }) => {
  return (
    <Modal className={`${className} max-w-[504px]`} label={title} onClose={onClose} showClose={false}>
      <div className="mt-lg text-center">{message}</div>
      <LeadButtons>
        <Button
          data-cy="systemMessage-button-nej"
          variant="solid"
          size="lg"
          onClick={handleCancel}
          className="w-full"
          type="button"
        >
          Nej
        </Button>
        <Button
          data-cy="systemMessage-button-ja"
          type="submit"
          variant="solid"
          size="lg"
          onClick={handleOk}
          color="primary"
          className="w-full"
        >
          Ja
        </Button>
      </LeadButtons>
    </Modal>
  );
};
