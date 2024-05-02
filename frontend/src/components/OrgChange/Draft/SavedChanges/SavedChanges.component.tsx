import { useSaveStore } from '@services/save-service/save-service';
import SavingSpinner from './SavingSpinner/SavingSpinner.component';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

export default function SavedChanges() {
  const isUnsaved = useSaveStore((s) => s.isUnsaved);
  const isSaving = useSaveStore((s) => s.isSaving);
  return (
    <div className="flex items-center text-primary text-sm">
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
              <CheckCircleOutlinedIcon className="material-icon ml-xs" />
            </span>
          )}
        </>
      )}
    </div>
  );
}
