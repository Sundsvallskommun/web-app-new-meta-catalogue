import { LeadButtons } from '@layouts/ButtonGroup/LeadButtons';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { getRootOrg } from '@services/mdviewer/api-calls/organization';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { Select } from '@sk-web-gui/forms';
import { Button, FormControl, FormErrorMessage, FormLabel, Modal } from '@sk-web-gui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface IChooseCompanyForDraftProps {
  onClose;
  setData?;
}

const ChooseCompanyForDraft = (props: IChooseCompanyForDraftProps) => {
  const { onClose } = props;
  const router = useRouter();
  const { treeImage, setTreeImage } = useOrganizationStore();
  const setDraft = useOrgChangeStore((s) => s.setDraft);
  const blankDraft = useOrgChangeStore((s) => s.blankDraft);

  const modalIsOpen = true;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState('');

  const getTreeImage = () => {
    getRootOrg().then((res) => {
      if (!res.error) {
        setTreeImage(res.data);
        if (res.data.length > 0) {
          setCompanyId(res.data[0].companyId);
          setCompanyName(res.data[0].orgName);
        }
      }
    });
  };

  const onCompanyChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = parseInt(e.target.value);
    setCompanyId(value);
    setCompanyName(treeImage.find((x) => x.companyId === value).orgName);
  };

  const onCloseHandler = () => {
    onClose();
    setError(false);
    setErrorMessage('');
    setIsLoading(false);
  };

  const filterGoToDraft = async () => {
    if (companyId !== null) {
      await blankDraft();
      setDraft((draft) => ({ ...draft, companyId: companyId, companyName: companyName }));
      router.push('/hanteraorganisation/utkast');
      onCloseHandler();
    }
  };

  useEffect(() => {
    getTreeImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      className="max-w-[500px]"
      show={modalIsOpen}
      onClose={onCloseHandler}
      label={'Välj vilket bolag som du vill göra förändringar i'}
    >
      <div>
        <FormControl id="orgchange-choose-company">
          <FormLabel id="choosecompany">
            <strong>Välj bolag</strong>
          </FormLabel>
          <Select
            size="lg"
            placeholder="Välj bolag"
            className="w-full mt-[6px]"
            data-cy="orgchange-choose-company"
            id="orgchange-choose-company"
            aria-labelledby="choosecompany"
            onChange={onCompanyChange}
            value={companyId ?? undefined}
          >
            {treeImage?.map((c) => (
              <Select.Option key={`${c.companyId}`} value={c.companyId}>
                {c.orgName}
              </Select.Option>
            )) || []}
          </Select>
        </FormControl>
      </div>

      <LeadButtons>
        <Button variant="solid" size="lg" onClick={onCloseHandler} className="my-sm sm:my-6 w-full" type="button">
          {'Avbryt'}
        </Button>
        <Button
          onClick={() => filterGoToDraft()}
          variant="solid"
          size="lg"
          type="submit"
          color="primary"
          className="my-sm sm:my-6 w-full"
          loading={isLoading}
          loadingText="Sparar"
        >
          Välj och fortsätt
        </Button>
      </LeadButtons>
      {error && (
        <div className="w-full flex justify-between space-x-2 my-lg">
          <FormErrorMessage>
            <span>{errorMessage ? errorMessage : 'Det gick inte att spara åtgärd'}</span>
          </FormErrorMessage>
        </div>
      )}
    </Modal>
  );
};

export default ChooseCompanyForDraft;
