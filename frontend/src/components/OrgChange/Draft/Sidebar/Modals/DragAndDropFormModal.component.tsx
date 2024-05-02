import { OrgnodeMoveDto } from '@data-contracts/backend/data-contracts';
import LeadButtons from '@layouts/ButtonGroup/LeadButtons';
import ArrowForwardSharpIcon from '@mui/icons-material/ArrowForwardSharp';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useSaveStore } from '@services/save-service/save-service';
import { Button, Modal, useMessage } from '@sk-web-gui/react';

interface IDragAndDropFormModal {
  onClose;
  draggedItem;
  newParent;
  oldParent;
}

export default function DragAndDropFormModal(props: IDragAndDropFormModal) {
  const { onClose, draggedItem, newParent, oldParent } = props;
  const moveNode = useOrgChangeStore((s) => s.moveNode);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const setIsSaving = useSaveStore((s) => s.setIsSaving);

  const message = useMessage();

  const onSubmit = () => {
    const dataBody: OrgnodeMoveDto = {
      orgId: draggedItem.id,
      newParentId: newParent.id,
    };
    setIsSaving(true);
    moveNode(dataBody).then((res) => {
      if (!res.error) {
        message({
          message: `Grenen flyttas från ${oldParent.label} nivå ${oldParent.level} till ${newParent.label} nivå ${newParent.level}`,
          status: 'success',
        });
        setSelectedOrganizationId(dataBody.orgId as number);
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
      className="max-w-[600px] w-full"
      show={true}
      onClose={onClose}
      label={`Flyttar ${draggedItem.label} nivå ${draggedItem.level}`}
    >
      <div>
        <div>
          <div className="w-full">
            <ul className="flex items-center gap-8 justify-evenly">
              <li className="text-gray-400 text-lg font-bold max-w-[200px] w-full">
                Förälder: {oldParent.label} Nivå {oldParent.level}
              </li>
              <li>
                <ArrowForwardSharpIcon className="!text-3xl" />
              </li>

              <li className="max-w-[200px] w-full text-lg font-bold">
                Förälder: {newParent.label} Nivå {newParent.level}
              </li>
            </ul>
          </div>
          <LeadButtons>
            <Button variant="solid" size="lg" onClick={onClose} className="my-sm sm:my-6 w-full" type="button">
              {'Avbryt'}
            </Button>
            <Button
              variant="solid"
              size="lg"
              color="primary"
              className="my-sm sm:my-6 w-full"
              type="submit"
              loadingText="Sparar"
              onClick={onSubmit}
            >
              Spara
            </Button>
          </LeadButtons>
        </div>
      </div>
    </Modal>
  );
}
