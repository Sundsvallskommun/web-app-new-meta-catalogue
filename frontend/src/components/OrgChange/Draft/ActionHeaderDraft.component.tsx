import DraftContextmenu from '@components/OrgChange/DraftContextMenu.component';
import VerifyButton from './VerifyButton/VerifyButton.component';

export default function ActionHeaderDraft() {
  return (
    <div className="lg:flex gap-[3rem] items-end">
      <VerifyButton />
      <DraftContextmenu />
    </div>
  );
}
