import { Modal, Spinner } from '@sk-web-gui/react';

export default function LoaderFullScreenModal({ show = false, label = 'Laddar information' }) {
  return (
    <Modal show={show} label={label} hideClosebutton disableCloseOutside className={'!w-[30rem]'}>
      <div className="flex place-items-center place-content-center">
        <Spinner size="lg" aria-label={label} />
      </div>
    </Modal>
  );
}
