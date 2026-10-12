import { Disclosure, Badge } from '@sk-web-gui/react';
import { ChangesInOrganizationList } from './ChangsInOrganizationList/ChangesInOrganizationList.component';

const BadgeTitle = ({ changesCount }) => {
  return (
    <span className="flex gap-7">
      <span>
        <Badge color="warning" size="md" counter={changesCount > 99 ? '99+' : changesCount} />
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
      <Disclosure variant="alt">
        <Disclosure.Header>
          <Disclosure.Title>
            <BadgeTitle changesCount={changesCount} />
          </Disclosure.Title>
          <Disclosure.Button />
        </Disclosure.Header>
        <Disclosure.Content>
          <div>
            <ChangesInOrganizationList
              changesTexts={Array.from(Array(changesCount).keys()).map((x) => `Ändring ${x + 1}`)}
            />
          </div>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
};

export default ChangesInOrganization;
