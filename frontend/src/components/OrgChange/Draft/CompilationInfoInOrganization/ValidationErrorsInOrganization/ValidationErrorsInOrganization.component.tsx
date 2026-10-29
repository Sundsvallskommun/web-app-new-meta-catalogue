import { Badge, Disclosure } from '@sk-web-gui/react';
import ValidationErrorsInOrganizationList from './ValidationErrorsInOrganizationList/ValidationErrorsInOrganizationList.component';

const BadgeTitle = ({ errorCount }) => {
  return (
    <span className="flex gap-7">
      <span>
        <Badge color="error" size="md" counter={errorCount > 99 ? '99+' : errorCount} />
      </span>
      <span className="flex items-center content-center">Valideringsfel</span>
    </span>
  );
};

interface IErrorProps {
  errorMessages;
}

export default function ValidationErrorsInOrganization(props: IErrorProps) {
  const { errorMessages } = props;

  return (
    <div>
      <Disclosure variant="alt" initalOpen>
        <Disclosure.Header>
          <Disclosure.Title>
            <BadgeTitle errorCount={errorMessages.length} />
          </Disclosure.Title>
          <Disclosure.Button />
        </Disclosure.Header>
        <Disclosure.Content>
          <div>
            <ValidationErrorsInOrganizationList errors={errorMessages} />
          </div>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
}
