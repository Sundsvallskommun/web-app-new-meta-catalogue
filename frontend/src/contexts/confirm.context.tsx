import { ConfirmModal } from '@components/Modal/ConfirmModal.component';
import React, { useContext, useRef, useState } from 'react';

type UseModalShowReturnType = {
  show: boolean;
  setShow: (value: boolean) => void;
  onHide: () => void;
};

const useModalShow = (): UseModalShowReturnType => {
  const [show, setShow] = useState(false);

  const handleOnHide = () => {
    setShow(false);
  };

  return {
    show,
    setShow,
    onHide: handleOnHide,
  };
};

type ModalContextType = {
  showConfirmation: (title: string, message: string | JSX.Element) => Promise<boolean>;
};

type ConfirmationModalContextProviderProps = {
  children: React.ReactNode;
};

const ConfirmationModalContext = React.createContext<ModalContextType>({} as ModalContextType);

const ConfirmationModalContextProvider: React.FC<ConfirmationModalContextProviderProps> = (props) => {
  const { setShow, show, onHide } = useModalShow();
  const [content, setContent] = useState<{ title: string; message: string | JSX.Element } | null>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolver = useRef<any>();

  const handleShow = (title: string, message: string | JSX.Element): Promise<boolean> => {
    setContent({
      title,
      message,
    });
    setShow(true);
    return new Promise(function (resolve) {
      resolver.current = resolve;
    });
  };

  const modalContext: ModalContextType = {
    showConfirmation: handleShow,
  };

  const handleOk = () => {
    if (resolver.current) {
      resolver.current(true);
    }
    onHide();
  };

  const handleCancel = () => {
    if (resolver.current) {
      resolver.current(false);
    }
    onHide();
  };

  return (
    <ConfirmationModalContext.Provider value={modalContext}>
      {props.children}

      {content && show && (
        <ConfirmModal
          onClose={onHide}
          title={content.title}
          message={content.message}
          handleCancel={handleCancel}
          handleOk={handleOk}
        />
      )}
    </ConfirmationModalContext.Provider>
  );
};

const useConfirm = (): ModalContextType => useContext(ConfirmationModalContext);

export { useModalShow, useConfirm };

export default ConfirmationModalContextProvider;
