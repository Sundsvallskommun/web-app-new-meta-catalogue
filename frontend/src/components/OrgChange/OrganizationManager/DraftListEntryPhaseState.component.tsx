import { draftListEntry } from '@services/mdbuilder/orgchange-service';
import { Icon, Label, cx } from '@sk-web-gui/react';

export default function DraftListEntryPhaseState({ draft }) {
  const { phaseColor, phaseLabel, PhaseIcon } = draftListEntry(draft);

  return (
    <Label className={`text-body ${phaseColor.bg} ${phaseColor.icon} ${phaseColor.border}`}>
      <span className="flex items-center">
        {PhaseIcon && <Icon className="mr-xs" icon={<PhaseIcon />} />}
        <span className={cx(`text-xs`, phaseColor.text)}>{`${phaseLabel}`}</span>
      </span>
    </Label>
  );
}
