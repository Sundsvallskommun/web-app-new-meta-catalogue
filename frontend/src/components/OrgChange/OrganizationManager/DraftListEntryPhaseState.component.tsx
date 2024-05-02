import { draftListEntry } from '@services/mdbuilder/orgchange-service';
import { Tag, cx } from '@sk-web-gui/react';

export default function DraftListEntryPhaseState({ draft }) {
  const { phaseColor, phaseLabel, PhaseIcon } = draftListEntry(draft);

  return (
    <Tag variant="solid" className={`text-body ${phaseColor.bg} ${phaseColor.icon} ${phaseColor.border}`}>
      <span className="flex items-center">
        {PhaseIcon && <PhaseIcon className={`mr-xs`} />}
        <span className={cx(`text-xs`, phaseColor.text)}>{`${phaseLabel}`}</span>
      </span>
    </Tag>
  );
}
