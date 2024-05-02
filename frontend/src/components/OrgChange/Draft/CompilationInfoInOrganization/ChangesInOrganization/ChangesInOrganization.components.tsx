import { Disclosure, Badge } from '@sk-web-gui/react';
import { ChangesInOrganizationList } from './ChangsInOrganizationList/ChangesInOrganizationList.component';

const BadgeTitle = ({ changesCount }) => {
  return (
    <span className="flex gap-3">
      <span>
        <Badge color="warning" variant="solid" size="lg" max={99} counter={changesCount} noBorder />
      </span>
      <span className="flex items-center content-center">Förändringar</span>
    </span>
  );
};
interface IChangesProps {
  changesCount;
}

export const ChangesInOrganization = (props: IChangesProps) => {
  const { changesCount } = props;

  return (
    <div className="px-[20px]">
      <Disclosure header={<BadgeTitle changesCount={changesCount} />} alert noMargin variant="solid">
        <div>
          <ChangesInOrganizationList
            changesTexts={Array.from(Array(changesCount).keys()).map((x) => `Ändring ${x + 1}`)}
          />
        </div>
      </Disclosure>
    </div>
  );
};

export default ChangesInOrganization;
