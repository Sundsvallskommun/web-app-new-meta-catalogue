import { draftListEntry } from '@services/mdbuilder/orgchange-service';
import { Label } from '@sk-web-gui/react';

export default function DraftListEntryPhaseState({ draft }) {
  const { phaseColor, phaseInverted, phaseLabel } = draftListEntry(draft);

  return (
    <Label color={phaseColor} inverted={phaseInverted} rounded className="whitespace-nowrap">
      {phaseLabel}
    </Label>
  );
}
