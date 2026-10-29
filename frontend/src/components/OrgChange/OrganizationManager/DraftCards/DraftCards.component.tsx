import { Draft } from '@data-contracts/backend/data-contracts';
import { Card, Spinner, cx } from '@sk-web-gui/react';
import { Calendar } from 'lucide-react';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import dayjs from 'dayjs';
import DraftContextMenu from '../../DraftContextMenu.component';
import DraftListEntryPhaseMessage from '../DraftListEntryPhaseMessage.component';
import DraftListEntryPhaseState from '../DraftListEntryPhaseState.component';
import DraftListEntryPhaseTitle from '../DraftListEntryPhaseTitle.component';

interface DraftDataListProps {
  draftData: Draft[];
  draftsIsLoading: boolean;
}

const DraftCards = (props: DraftDataListProps) => {
  const { draftData, draftsIsLoading } = props;

  const cards = draftData.map((d) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { draftIsArchived } = useDraftPhaseState(d);
    return (
      <Card
        key={d.draftId}
        color={draftIsArchived ? 'tertiary' : 'mono'}
        className={cx(draftIsArchived && '!bg-primitives-gray-200 dark:!bg-primitives-gray-700')}
      >
        <Card.Body className="w-full">
          <div>
            <div className="flex justify-between">
              <div className="flex flex-col-reverse">
                <h2 className="mt-sm text-large w-full flex flex-col gap-y-[.4rem]">
                  <DraftListEntryPhaseTitle draft={d} />
                  <div className="font-[Arial] w-full leading-[2rem] font-normal text-small">
                    Skapad av {d.loginname}
                  </div>
                </h2>
                <p className="flex items-center gap-4 text-dark-secondary text-small">
                  <Calendar size={16} aria-hidden="true" />
                  <span>
                    Brytdatum {dayjs(d.cutOffDate).format('DD MMM YYYY')} ·{' '}
                    {d.changes >= 1 ?
                      d.changes === 1 ?
                        '1 ändring'
                      : `${d.changes} ändringar`
                    : 'Inga ändringar'}
                  </span>
                </p>
              </div>
              <div>{!draftIsArchived && <DraftContextMenu dense draft={d} />}</div>
            </div>

            <p className="lg:min-h-[48px] max-w-[386px]">
              {d.nodes.length > 0 && `${d.nodes.join(', ')}, under ${d.companyName}`}
            </p>
          </div>
          <div className="w-full flex flex-col items-start gap-16 mt-16 self-end">
            <DraftListEntryPhaseState draft={d} />
            <DraftListEntryPhaseMessage draft={d} />
          </div>
        </Card.Body>
      </Card>
    );
  });
  return (
    <div className="orgchange-cards h-full">
      <div className="h-full">
        {draftsIsLoading ?
          <div className="flex w-full min-h-[400px] justify-center align-middle items-center">
            <Spinner size={3} aria-label="Hämtar Utkast" />
          </div>
        : <div className="min-h-[400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">{cards}</div>
          </div>
        }
      </div>
    </div>
  );
};

export default DraftCards;
