import { Badge, Disclosure } from '@sk-web-gui/react';
import ValidationErrorsInOrganizationList from './ValidationErrorsInOrganizationList/ValidationErrorsInOrganizationList.component';

const BadgeTitle = ({ errorCount }) => {
  return (
    <span className="flex gap-3">
      <span>
        <Badge color="error" variant="solid" size="lg" max={99} counter={errorCount} noBorder />
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
    <div className="px-[20px]">
      <Disclosure header={<BadgeTitle errorCount={errorMessages.length} />} error variant="solid" noMargin initalOpen>
        <div>
          <ValidationErrorsInOrganizationList errors={errorMessages} />
        </div>
      </Disclosure>
    </div>
  );
}
