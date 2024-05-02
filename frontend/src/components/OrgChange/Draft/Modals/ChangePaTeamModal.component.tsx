import Loader from '@components/Loader/Loader.component';
import {
  EmploymentChangeArrayDto,
  OrgChangeOrganizationEmployee,
  OrgChangePersonEmployeeDetail,
  PATeamSearchResult,
} from '@data-contracts/backend/data-contracts';
import LeadButtons from '@layouts/ButtonGroup/LeadButtons';
import UndoIcon from '@mui/icons-material/Undo';
import { useDebouncedCallback } from '@react-hookz/web';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { changeEmployment, getEmployeeDetails } from '@services/mdbuilder/api-calls/employment';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Combobox } from '@sk-web-gui/forms';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  OptionValueType,
  ProfilePicture,
  Radio,
  useMessage,
} from '@sk-web-gui/react';
import { apiURL } from '@utils/api-url';
import { renderNewOrOld } from '@utils/render-new-or-old';
import { FormEvent, Fragment, useEffect, useState } from 'react';
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

  const message = useMessage();

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

  const labelHeading = (
    <div>
      <h1 className="text-xl">
        <label id="searchpateam">Sök och välj PA-Team</label>
      </h1>
      <h2 className=" block font-normal text-lg leading-tight">
        {' '}
        För {`${peopleToHandle.length} personer`} under gren {organization.orgName} nivå 6
      </h2>
    </div>
  );

  const resetButton = (
    <Button
      className="border-0 float-right"
      type="button"
      size="md"
      variant="link"
      onClick={resetPa}
      aria-label={`Återställ PA-Team`}
      leftIcon={<UndoIcon className="material-icon !text-2xl" aria-hidden="true" />}
    >
      Ångra och återställ
    </Button>
  );

  return (
    <Modal className="max-w-[900px] h-fit" show onClose={handleOnClose} label={labelHeading}>
      <form onSubmit={onSubmit}>
        <FormControl id="pateam-edit-dropdown">
          <Combobox
            className="w-full"
            aria-labelledby="pateam-edit-dropdown-label"
            id="pateam-edit-dropdown"
            placeholder="Sök på PA-Team kod, benämning eller ansvarig chef"
            onChange={onPaTeamSelectHandler}
            onChangeSearch={onPaTeamChangeHandler}
            searchValue={searchValue}
            value={activePaTeam?.data?.paTeam ?? []}
            defaultValue={activePaTeam?.data?.paTeam ?? []}
          >
            <Combobox.List>
              {paSearchResults.map((item, index) => (
                <Combobox.Option key={`item-${item.paTeam}-${index}`} value={item.paTeam}>
                  {`${item.paTeam.trim()} - ${item.paTeamName.trim()} - ${item.managerName?.trim()}`}
                </Combobox.Option>
              ))}
            </Combobox.List>
          </Combobox>
        </FormControl>
        {activePaTeam && activePaTeam?.data?.paTeam !== initialPaTeam?.data?.paTeam && peopleToHandle.length === 1 && (
          <div className="w-full py-sm">{resetButton}</div>
        )}
        {!paTeamsByManagerIsLoading ?
          <>
            {(manager || paTeamsByManager.length !== 0) && (
              <div className="mt-lg">
                {manager && (
                  <div className="flex gap-2 items-center">
                    <ProfilePicture
                      className="w-[64px] h-[64px]"
                      placeholderImage={`${process.env.NEXT_PUBLIC_BASE_PATH}/user-image-placeholder-square-48.png`}
                      image={`${apiURL(`/employee/${manager.personId}/personimage`)}`}
                    />
                    <h3 className="font-normal text-base">
                      <strong className="block">Överordnad chef</strong>
                      {manager?.givenname} {manager?.lastname} |{' '}
                      {manager?.employments?.map((e, index) => {
                        return (
                          <span key={`employment-${index}-${e.department}`}>
                            {e.title} {e.department}
                          </span>
                        );
                      })}
                    </h3>
                  </div>
                )}
                {paTeamsByManager.length !== 0 ?
                  <div className="my-lg">
                    <h3 className="pb-sm border-b border-gray-400 text-base">
                      {!manager ? `PA-Team (kopplade till ${activePaTeam.data.managerName})` : 'PA-Team'}
                    </h3>

                    <Radio.Group>
                      <ul className="pb-lg">
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
                            <li key={`li-${pa.paTeam}`} className="p-sm [&:has(input:checked)]:bg-[#D9E6EF]">
                              <Radio
                                value={pa.paTeam}
                                key={pa.paTeam}
                                name="pateam"
                                className={`mr-md`}
                                size="xl"
                                color="primary"
                                required
                                onChange={() => onRadioValueSelectHandler(paObject)}
                                defaultChecked={activePaTeam?.data.paTeam === pa.paTeam}
                              >
                                <span>
                                  {pa.paTeam} {pa.paTeamName}
                                </span>
                              </Radio>
                            </li>
                          );
                        })}
                      </ul>
                    </Radio.Group>
                  </div>
                : <></>}
              </div>
            )}
          </>
        : <div className="py-xl flex justify-center items-center">
            <Loader size="xl" />
          </div>
        }
        {errorMessage && (
          <div className="w-full flex justify-between space-x-2 my-lg">
            <FormErrorMessage>
              <span>{errorMessage ? errorMessage : 'Det gick inte att spara åtgärd'}</span>
            </FormErrorMessage>
          </div>
        )}
        {peopleToHandle.length !== 0 && (
          <MarkedPeopleList
            peopleToHandle={peopleToHandle}
            contextColumn={{
              header: 'PA-Team',
              element: (p) => (
                <Fragment>
                  <span className="inline font-bold lg:hidden">PA-Team: </span>
                  <span className="lg:float-left">
                    <span className="lg:font-bold lg:text-sm lg:float-left">
                      {renderNewOrOld(p.newPATeam, p.paTeam)}
                    </span>
                    <br />
                    <span className="inline font-bold lg:hidden">PA-Team-namn: </span>
                    <span>{renderNewOrOld(p.newPATeamName, p.paTeamName)}</span>
                  </span>
                </Fragment>
              ),
            }}
          />
        )}
        {activePaTeam && activePaTeam?.data?.paTeam !== initialPaTeam?.data?.paTeam && (
          <FormLabel className="text-base my-md">
            <strong>
              Notera att chef inte kommer ändras i samband med ändring av PA-Team. För ändring av chef hänvisas du till
              manuell hantering i Heroma
            </strong>
          </FormLabel>
        )}
        <LeadButtons>
          <Button type="button" onClick={handleOnClose}>
            Stäng
          </Button>
          <Button
            variant="solid"
            type="submit"
            color="primary"
            aria-disabled={activePaTeam?.data?.paTeam == initialPaTeam?.data?.paTeam ? 'true' : undefined}
          >
            Spara
          </Button>
        </LeadButtons>
      </form>
    </Modal>
  );
}
