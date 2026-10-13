import { draftListEntry } from '@services/mdbuilder/orgchange-service';
import { Icon, Label } from '@sk-web-gui/react';

export default function DraftListEntryPhaseState({ draft }) {
  const { phaseColor, phaseInverted, phaseLabel, PhaseIcon } = draftListEntry(draft);

  return (
    <Label color={phaseColor} inverted={phaseInverted} rounded>
      <span className="flex items-center">
        {PhaseIcon && <Icon className="mr-xs" icon={<PhaseIcon />} />}
        {`${phaseLabel}`}
      </span>
    </Label>
  );
}
