import DraftContextmenu from '@components/OrgChange/DraftContextMenu.component';
import VerifyButton from './VerifyButton/VerifyButton.component';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';

export default function ActionHeaderDraft() {
  const loginname = useOrgChangeStore((s) => s.draft.loginname);
  return (
    <div className="lg:flex gap-[3rem] items-center">
      <VerifyButton />
      <DraftContextmenu />
      <div className="hidden lg:block w-[1px] h-[2.4rem] bg-neutral-300"></div>
      <div className="text-body">Skapad av {loginname}</div>
    </div>
  );
}
