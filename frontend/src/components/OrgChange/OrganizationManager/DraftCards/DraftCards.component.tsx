import { Draft } from '@data-contracts/backend/data-contracts';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import { Card, CardList, Spinner, cx } from '@sk-web-gui/react';
import DraftContextMenu from '../../DraftContextMenu.component';
import DraftListEntryPhaseMessage from '../DraftListEntryPhaseMessage.component';
import DraftListEntryPhaseState from '../DraftListEntryPhaseState.component';
import DraftListEntryPhaseTitle from '../DraftListEntryPhaseTitle.component';
import dayjs from 'dayjs';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';

interface DraftDataListProps {
  draftData: Draft[];
  draftsIsLoading: boolean;
}

const DraftCards = (props: DraftDataListProps) => {
  const { draftData, draftsIsLoading } = props;

  const cards = draftData.map((d, i) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { draftIsArchived } = useDraftPhaseState(d);
    return (
      <Card
        className={cx(`p-10 flex flex-col justify-between`, draftIsArchived ? 'bg-[#E4E4E5] text-gray' : 'bg-gray-50')}
        key={`${i}`}
      >
        <div>
          <div className="flex justify-between">
            <div className="flex flex-col-reverse">
              <h2 className="mt-sm text-lg leading-lg w-full">
                <DraftListEntryPhaseTitle draft={d} />
              </h2>
              <div className="text-neutral-700 text-sm leading-md lg:flex lg:items-center">
                <CalendarIcon />
                <span className="px-xs">Brytdatum {dayjs(d.cutOffDate).format('DD MMM YYYY')} </span>
                <span className="w-[1px] h-[16px] bg-neutral-300"></span>
                <div className="lg:inline lg:pl-xs">
                  {d.changes >= 1 ?
                    d.changes === 1 ?
                      '1 ändring'
                    : `${d.changes} ändringar`
                  : 'Inga ändringar'}
                </div>
              </div>
            </div>
            <div>{!draftIsArchived && <DraftContextMenu dense draft={d} className="right-0" />}</div>
          </div>

          <p className="lg:min-h-[48px] max-w-[386px]">
            {d.nodes.length > 0 && `${d.nodes.join(', ')}, under ${d.companyName}`}
          </p>
        </div>
        <div className="w-full flex justify-between items-center self-end">
          <span className="lg:flex lg:items-center align-bottom gap-5">
            <DraftListEntryPhaseState draft={d} />
          </span>
          <DraftListEntryPhaseMessage draft={d} />
        </div>
      </Card>
    );
  });
  return (
    <div className="orgchange-cards h-full">
      <div className="h-full">
        {draftsIsLoading ?
          <div className="flex w-full min-h-[400px] justify-center align-middle items-center">
            <Spinner size="xl" aria-label="Hämtar Utkast" />
          </div>
        : <div className="min-h-[400px]">
            <CardList className="lg:p-lg">{cards}</CardList>
          </div>
        }
      </div>
    </div>
  );
};

export default DraftCards;
