import DraftContextmenu from '@components/OrgChange/DraftContextMenu.component';
import VerifyButton from './VerifyButton/VerifyButton.component';

export default function ActionHeaderDraft() {
  return (
    <div className="flex flex-wrap gap-12 items-center">
      <VerifyButton />
      <DraftContextmenu />
    </div>
  );
}
