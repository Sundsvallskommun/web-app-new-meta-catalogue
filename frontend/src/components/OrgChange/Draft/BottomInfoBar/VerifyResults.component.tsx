import { DraftTreeOrganization } from '@interfaces/orgchange';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { Link } from '@sk-web-gui/react';
import { useEffect, useState } from 'react';
import ValidationErrorsInOrganization from '../CompilationInfoInOrganization/ValidationErrorsInOrganization/ValidationErrorsInOrganization.component';

const errorHeadingForType = (errorType) => {
  switch (errorType) {
    case 'missingParent':
      return 'Saknar förälder';
    case 'noChildren':
      return 'Saknar undernoder';
    case 'longNames':
      return 'För långt kortnamn';
    default:
      return 'Övrigt fel';
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const arrayToDict = (array: any[], keyName: string) => {
  return array.reduce((prev, curr) => {
    prev[curr[keyName]] = curr;
    return prev;
  }, {});
};

const ErrorList = ({ errorType, errors, onClick }) => {
  const orgTreeOrganizations = useOrgChangeStore((s) => s.orgTreeOrganizations);
  const lastChangeDate = useOrgChangeStore((s) => s.lastChangeDate);

  const [orgTreeFlatDict, setOrgTreeFlatDict] = useState<{
    [orgId: DraftTreeOrganization['id']]: DraftTreeOrganization;
  }>(arrayToDict(orgTreeOrganizations, 'id'));

  useEffect(() => {
    setOrgTreeFlatDict(arrayToDict(orgTreeOrganizations, 'id'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastChangeDate]);

  return (
    <>
      <h3 className="text-base">{errorHeadingForType(errorType)}</h3>
      <ul className="list-disc ml-[1.5em] mb-sm">
        {errors.map((message) => (
          <li key={`${message.orgId}`}>
            {orgTreeFlatDict[message.orgId] ?
              <Link as="span" onClick={() => onClick(message.orgId)}>
                {orgTreeFlatDict[message.orgId] ? orgTreeFlatDict[message.orgId].label : message.orgId}
              </Link>
            : <span>{message.orgId} (Finns ej i nodträdet)</span>}
          </li>
        ))}
      </ul>
    </>
  );
};

export default function VerifyResult({ selectedOrganizationId = null }) {
  const draft = useOrgChangeStore((s) => s.draft);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const [errorKeys] = useState(
    draft.verifyResult &&
      Object.keys(draft.verifyResult).filter((x) => x !== 'numberOfValidationErrors' && draft.verifyResult[x] !== null)
  );

  const handleSelectOrgId = (orgId: DraftTreeOrganization['id']) => {
    setSelectedOrganizationId(orgId);
  };

  if (draft.verifyResult?.numberOfValidationErrors === 0) return <></>;

  if (selectedOrganizationId) {
    const errorMessages = errorKeys.reduce((messages, errorType) => {
      const hasErrorType = draft.verifyResult[errorType].find((x) => x.orgId === selectedOrganizationId);
      if (hasErrorType) {
        messages.push(errorHeadingForType(errorType));
      }
      return messages;
    }, []);
    return <ValidationErrorsInOrganization errorMessages={errorMessages} />;
  } else {
    return (
      <div>
        {errorKeys.map((errorType) => {
          return (
            <div key={errorType}>
              {draft.verifyResult[errorType] ?
                <ErrorList errorType={errorType} errors={draft.verifyResult[errorType]} onClick={handleSelectOrgId} />
              : <></>}
            </div>
          );
        })}
      </div>
    );
  }
}
