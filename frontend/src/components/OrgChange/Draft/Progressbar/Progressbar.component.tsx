import { ProgressStepper } from '@sk-web-gui/react';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';

const steps = ['Utkast', 'Godkänd'];

export default function Progressbar() {
  const { draftIsApproved, draftIsExportPhase, draftIsExported, draftIsArchived } = useDraftPhaseState();
  const current = draftIsApproved || draftIsExportPhase || draftIsExported || draftIsArchived ? steps.length : 0;
  return <ProgressStepper steps={steps} current={current} labelPosition="bottom" size="sm" />;
}
