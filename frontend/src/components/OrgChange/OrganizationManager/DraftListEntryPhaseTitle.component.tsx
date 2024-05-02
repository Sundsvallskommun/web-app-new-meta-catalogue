import { Link } from '@sk-web-gui/react';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import NextLink from 'next/link';

export default function DraftListEntryPhaseTitle({ draft }) {
  const { draftIsArchived } = useDraftPhaseState(draft);

  if (draftIsArchived) {
    return <span>{draft.name}</span>;
  }

  return (
    <NextLink aria-label={`${draft.name}, utkast`} href={`/hanteraorganisation/utkast/${draft.draftId}`} passHref>
      <Link as="span" className="font-bold">
        {draft.name}
      </Link>
    </NextLink>
  );
}
