import { Modal, Spinner } from '@sk-web-gui/react';

export default function LoaderFullScreenModal({ show = false, label = 'Laddar information' }) {
  return (
    <Modal show={show} label={label} hideClosebutton disableCloseOutside className="max-w-[30rem]">
      <div className="flex place-items-center place-content-center">
        <Spinner size={2} aria-label={label} />
      </div>
    </Modal>
  );
}
