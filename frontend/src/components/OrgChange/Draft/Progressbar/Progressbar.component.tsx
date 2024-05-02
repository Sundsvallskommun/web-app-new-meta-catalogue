import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { progressbarPhase } from '@services/mdbuilder/orgchange-service';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';

export default function Progressbar() {
  const { draft } = useOrgChangeStore();
  const { draftIsReadOnly, draftIsApproved } = useDraftPhaseState();
  const { phase1bg, phase4bg } = progressbarPhase(draft.phase);
  return draft && draft.draftId ?
      <div className="Progressbar">
        <div className={`Progressbar-section ${!draftIsReadOnly && 'active'}`}>
          <div className="Progressbar-label">Utkast</div>
          <div className={`Progressbar-line ${phase1bg}`}></div>
        </div>
        <div className={`Progressbar-section ${draftIsApproved && 'active'}`}>
          <div className="Progressbar-label">Godkänd</div>
          <div className={`Progressbar-line ${phase4bg}`}></div>
        </div>
      </div>
    : <div className="Progressbar">
        <div className={`Progressbar-section active`}>
          <div className="Progressbar-label">Utkast</div>
          <div className={`Progressbar-dormentline Progressbar-prephase`}></div>
        </div>
        <div className={`Progressbar-section`}>
          <div className="Progressbar-label">Godkänd</div>
          <div className={`Progressbar-dormentline`}></div>
        </div>
      </div>;
}
