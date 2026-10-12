import { useSaveStore } from '@services/save-service/save-service';
import SavingSpinner from './SavingSpinner/SavingSpinner.component';
import { Icon } from '@sk-web-gui/react';
import { CircleCheck } from 'lucide-react';

export default function SavedChanges() {
  const isUnsaved = useSaveStore((s) => s.isUnsaved);
  const isSaving = useSaveStore((s) => s.isSaving);
  return (
    <div className="flex items-center text-vattjom-text-primary text-small">
      {isSaving ? (
        <span className="flex items-center">
          <span>Ändringar sparas</span>
          <SavingSpinner className="ml-xs" />
        </span>
      ) : (
        <>
          {isUnsaved ? (
            <>
              (<div>Du har osparade ändringar</div>)
            </>
          ) : (
            <span className="flex items-center">
              Dina senaste ändringar är sparade
              <Icon className="ml-xs" icon={<CircleCheck />} />
            </span>
          )}
        </>
      )}
    </div>
  );
}
