import { OrgnodeMoveDto } from '@data-contracts/backend/data-contracts';
import { DraftTreeOrganization } from '@interfaces/orgchange';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useSaveStore } from '@services/save-service/save-service';
import { Button, Modal, useSnackbar } from '@sk-web-gui/react';
import { ArrowRight } from 'lucide-react';

interface IDragAndDropFormModal {
  onClose: () => void;
  draggedItem: DraftTreeOrganization;
  newParent: DraftTreeOrganization;
  oldParent?: DraftTreeOrganization;
}

export default function DragAndDropFormModal(props: IDragAndDropFormModal) {
  const { onClose, draggedItem, newParent, oldParent } = props;
  const moveNode = useOrgChangeStore((s) => s.moveNode);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const setIsSaving = useSaveStore((s) => s.setIsSaving);

  const message = useSnackbar();

  const onSubmit = () => {
    const dataBody: OrgnodeMoveDto = {
      orgId: draggedItem.id,
      newParentId: newParent.id,
    };
    setIsSaving(true);
    moveNode(dataBody).then((res) => {
      if (!res.error) {
        message({
          message: `Grenen flyttas${oldParent ? ` från ${oldParent.label} nivå ${oldParent.level}` : ''} till ${newParent.label} nivå ${newParent.level}`,
          status: 'success',
        });
        setSelectedOrganizationId(draggedItem.id);
      } else {
        message({
          message: res.message,
          status: 'error',
        });
      }
      onClose();
      setIsSaving(false);
    });
  };

  return (
    <Modal
      className="w-[calc(100%-32px)] max-w-[600px] my-16"
      show
      onClose={onClose}
      label={`Flyttar ${draggedItem.label} nivå ${draggedItem.level}`}
    >
      <ul className="flex items-center justify-evenly gap-16">
        {oldParent && (
          <>
            <li className="w-full max-w-[200px] text-base md:text-lead text-dark-disabled">
              Förälder: {oldParent.label} Nivå {oldParent.level}
            </li>
            <li>
              <span className="sr-only">flyttas till</span>
              <ArrowRight className="w-24 h-24 md:w-32 md:h-32" aria-hidden="true" />
            </li>
          </>
        )}
        <li className="w-full max-w-[200px] text-base md:text-lead">
          Förälder: {newParent.label} Nivå {newParent.level}
        </li>
      </ul>
      <Modal.Footer>
        <Button variant="secondary" className="flex-1" type="button" onClick={onClose}>
          Avbryt
        </Button>
        <Button variant="primary" className="flex-1" type="button" loadingText="Sparar" onClick={onSubmit}>
          Spara
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
