import Loader from '@components/Loader/Loader.component';
import { PersonAvatar } from '@components/PersonHeader/PersonHeader.component';
import {
  EmploymentChangeArrayDto,
  OrgChangeOrganizationEmployee,
  OrgChangePersonEmployeeDetail,
  PATeamSearchResult,
} from '@data-contracts/backend/data-contracts';
import { Undo2 } from 'lucide-react';
import { useDebouncedCallback } from '@react-hookz/web';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { changeEmployment, getEmployeeDetails } from '@services/mdbuilder/api-calls/employment';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import {
  Alert,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  RadioButton,
  useSnackbar,
  Combobox,
} from '@sk-web-gui/react';
import { OptionValueType } from '@interfaces/option-value';
import { renderNewOrOld } from '@utils/render-new-or-old';
import { FormEvent, useEffect, useState } from 'react';
import { MarkedPeopleList } from './components/MarkedPeopleList.component';

interface IChangePaTeamProps {
  peopleToHandle: OrgChangeOrganizationEmployee[];
  closeCallback: () => void;
}

export default function ChangePaTeamModal(props: IChangePaTeamProps) {
  const { closeCallback, peopleToHandle } = props;
  const getPaSearchResults = useOrgChangeStore((s) => s.getPaSearchResults);
  const getPaTeamsByManager = useOrgChangeStore((s) => s.getPaTeamsByManager);
  const paSearchResults = useOrgChangeStore((s) => s.paSearchResults);
  const paTeamsByManagerIsLoading = useOrgChangeStore((s) => s.paTeamsByManagerIsLoading);
  const getEmployeesByOrg = useOrgChangeStore((s) => s.getEmployeesByOrg);
  const paTeamsByManager = useOrgChangeStore((s) => s.paTeamsByManager);
  const organization = useOrganizationStore((s) => s.organization);
  const [manager, setManager] = useState<OrgChangePersonEmployeeDetail>();
  const [errorMessage, setErrorMessage] = useState('');

  const message = useSnackbar();

  const initialPaTeam: OptionValueType<PATeamSearchResult> = peopleToHandle.length === 1 && {
    label: renderNewOrOld(peopleToHandle[0]?.newPATeam, peopleToHandle[0]?.paTeam),
    data: {
      managerId: peopleToHandle[0]?.managerId ? peopleToHandle[0]?.managerId : '',
      paTeam: renderNewOrOld(peopleToHandle[0]?.newPATeam, peopleToHandle[0]?.paTeam),
      paTeamName: renderNewOrOld(peopleToHandle[0]?.newPATeamName, peopleToHandle[0]?.paTeamName),
      managerName: peopleToHandle[0]?.managerName ? peopleToHandle[0]?.managerName : '',
    },
  };

  const [searchValue, setSearchValue] = useState<string>('');

  const [activePaTeam, setActivePaTeam] = useState<{ label: string; data: PATeamSearchResult }>(
    peopleToHandle.length === 1 && initialPaTeam.label ? initialPaTeam : undefined
  );

  const setPATeamSearchDelayQuery = useDebouncedCallback(
    (query: string) => {
      getPaSearchResults(query);
    },
    [],
    150,
    500
  );

  const doSearch = (query: string) => {
    if (query?.length > 1) {
      setPATeamSearchDelayQuery(query);
    }
  };

  const onPaTeamChangeHandler = (e: React.BaseSyntheticEvent) => {
    doSearch(e.target.value);
    setSearchValue(e.target.value);
  };

  const onPaTeamSelectHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;
    const value = paSearchResults.find((x) => x.paTeam === val);
    if (!value) return;
    setActivePaTeam({
      label: value.paTeam,
      data: value,
    });
  };

  const onRadioValueSelectHandler = (paObject) => {
    setActivePaTeam(paObject);
  };

  useEffect(() => {
    const changeManager = async (managerId: PATeamSearchResult['managerId'] | null) => {
      getPaTeamsByManager(managerId);
      if (managerId) {
        getEmployeeDetails(managerId).then((res) => {
          if (!res.error) {
            setManager(res.data);
          } else {
            message({
              message: `Uppgifter för chef kunde inte hämtas`,
              status: 'warning',
            });
          }
        });
      } else {
        setManager(null);
      }
    };

    doSearch(activePaTeam?.data?.paTeam);
    changeManager(activePaTeam?.data?.managerId ? activePaTeam?.data?.managerId : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePaTeam]);

  const handleOnClose = async () => {
    if (activePaTeam?.data?.paTeam !== initialPaTeam?.data?.paTeam && activePaTeam !== undefined) {
      const shouldClose = await window.confirm(
        'Du har osparade ändringar. Är du säker på att du vill lämna den här sidan?'
      );
      if (!shouldClose) return;
    }
    closeCallback();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (activePaTeam.data) {
      if (activePaTeam.data?.paTeam !== initialPaTeam?.data?.paTeam) {
        const dataBody: EmploymentChangeArrayDto['people'] = peopleToHandle.map((x) => ({
          personId: x.personId,
          orgId: x.orgId,
          newPATeam: activePaTeam.data.paTeam,
        }));

        changeEmployment(dataBody).then((res) => {
          if (!res.error) {
            getEmployeesByOrg(organization.id);
            message({
              message: `Ändringar på PA-Team sparas`,
              status: 'success',
            });
            setActivePaTeam(initialPaTeam);
            closeCallback();
          } else {
            setErrorMessage(res.message);
          }
        });
      }
    }
  };

  const resetPa = () => {
    setActivePaTeam(initialPaTeam);
  };

  const resetButton = (
    <Button
      type="button"
      size="sm"
      variant="tertiary"
      onClick={resetPa}
      aria-label={`Återställ PA-Team`}
      leftIcon={<Undo2 />}
    >
      Ångra och återställ
    </Button>
  );

  return (
    <Modal className="w-full max-w-[900px]" show onClose={handleOnClose} label="Ändra PA-Team">
      <form id="change-pa-team-modal-form" onSubmit={onSubmit} className="flex flex-col gap-16">
        <p className="text-small text-dark-secondary">
          För {`${peopleToHandle.length} personer`} under gren {organization.orgName} nivå 6
        </p>
        <FormControl id="pateam-edit-dropdown" className="w-full">
          <FormLabel>PA-Team</FormLabel>
          <Combobox
            className="w-full"
            aria-labelledby="pateam-edit-dropdown-label"
            id="pateam-edit-dropdown"
            onChange={onPaTeamSelectHandler}
            onChangeSearch={onPaTeamChangeHandler}
            searchValue={searchValue}
            value={activePaTeam?.data?.paTeam ?? []}
            defaultValue={activePaTeam?.data?.paTeam ?? []}
          >
            <Combobox.Input className="w-full" placeholder="Sök på PA-Team kod, benämning eller ansvarig chef" />
            {/* v3 Combobox.List only rebuilds its options when the search text changes, not when results arrive */}
            <Combobox.List key={paSearchResults.map((item) => item.paTeam).join()}>
              {paSearchResults.map((item, index) => (
                <Combobox.Option key={`item-${item.paTeam}-${index}`} value={item.paTeam}>
                  {`${item.paTeam.trim()} - ${item.paTeamName.trim()} - ${item.managerName?.trim()}`}
                </Combobox.Option>
              ))}
            </Combobox.List>
          </Combobox>
        </FormControl>
        {activePaTeam && activePaTeam?.data?.paTeam !== initialPaTeam?.data?.paTeam && peopleToHandle.length === 1 && (
          <div>{resetButton}</div>
        )}
        {!paTeamsByManagerIsLoading ?
          <>
            {(manager || paTeamsByManager.length !== 0) && (
              <div className="flex flex-col gap-16">
                {manager && (
                  <div className="flex gap-16 items-center">
                    <PersonAvatar
                      personId={manager.personId}
                      givenname={manager.givenname}
                      lastname={manager.lastname}
                      size="md"
                    />
                    <div>
                      <p className="text-small text-dark-secondary">Överordnad chef</p>
                      <p>
                        {manager?.givenname} {manager?.lastname}
                      </p>
                      {manager?.employments?.map((e, index) => (
                        <p key={`employment-${index}-${e.department}`} className="text-small">
                          {e.title} {e.department}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {paTeamsByManager.length !== 0 ?
                  <fieldset className="flex flex-col gap-8">
                    <legend className="text-label-medium mb-8">
                      {!manager ? `PA-Team (kopplade till ${activePaTeam.data.managerName})` : 'PA-Team'}
                    </legend>

                    <RadioButton.Group>
                      <ul>
                        {paTeamsByManager.map((pa) => {
                          const paObject = {
                            label: pa.paTeam,
                            data: {
                              managerId: pa.managerId,
                              paTeam: pa.paTeam,
                              paTeamName: pa.paTeamName,
                              managerName: pa.managerName,
                            },
                          };

                          return (
                            <li
                              key={`li-${pa.paTeam}`}
                              className="p-sm [&:has(input:checked)]:bg-vattjom-background-100"
                            >
                              <RadioButton
                                value={pa.paTeam}
                                key={pa.paTeam}
                                name="pateam"
                                className={`mr-md`}
                                size="lg"
                                required
                                onChange={() => onRadioValueSelectHandler(paObject)}
                                defaultChecked={activePaTeam?.data.paTeam === pa.paTeam}
                              >
                                <span>
                                  {pa.paTeam} {pa.paTeamName}
                                </span>
                              </RadioButton>
                            </li>
                          );
                        })}
                      </ul>
                    </RadioButton.Group>
                  </fieldset>
                : <></>}
              </div>
            )}
          </>
        : <div className="py-xl flex justify-center items-center">
            <Loader size="xl" />
          </div>
        }
        {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
        {peopleToHandle.length !== 0 && (
          <MarkedPeopleList
            peopleToHandle={peopleToHandle}
            contextColumn={{
              header: 'PA-Team',
              element: (p) => (
                <>
                  {renderNewOrOld(p.newPATeam, p.paTeam)}
                  <br />
                  {renderNewOrOld(p.newPATeamName, p.paTeamName)}
                </>
              ),
            }}
          />
        )}
        {activePaTeam && activePaTeam?.data?.paTeam !== initialPaTeam?.data?.paTeam && (
          <Alert type="info">
            <Alert.Icon />
            <Alert.Content>
              <Alert.Content.Description>
                Notera att chef inte kommer ändras i samband med ändring av PA-Team. För ändring av chef hänvisas du
                till manuell hantering i Heroma.
              </Alert.Content.Description>
            </Alert.Content>
          </Alert>
        )}
      </form>
      <Modal.Footer>
        <Button variant="secondary" type="button" onClick={handleOnClose}>
          Avbryt
        </Button>
        <Button
          className="ml-auto"
          variant="primary"
          type="submit"
          form="change-pa-team-modal-form"
          color="primary"
          aria-disabled={activePaTeam?.data?.paTeam == initialPaTeam?.data?.paTeam ? 'true' : undefined}
        >
          Spara
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
