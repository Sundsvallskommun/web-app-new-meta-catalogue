import { Link } from 'lucide-react';
import { Button, Modal, useSnackbar } from '@sk-web-gui/react';
import { appURL } from '@utils/app-url';

export default function ShareModal(props) {
  const { onClose, draft } = props;
  const message = useSnackbar();

  const onCopyLink = async () => {
    navigator.clipboard.writeText(`${appURL()}/hanteraorganisation/utkast/${draft.draftId}`).then(
      function () {
        message({
          message: `Länk till sidan är kopierad`,
          status: 'success',
        });
      },
      function () {
        message({
          message: `Länken kunde inte kopieras`,
          status: 'error',
        });
      }
    );
  };

  return (
    <Modal className="max-w-[500px]" show={true} label={'Dela utkast'} onClose={onClose}>
      <div>
        <Button onClick={onCopyLink} variant="secondary" leftIcon={<Link />}>
          Kopiera länk
        </Button>
      </div>
    </Modal>
  );
}
