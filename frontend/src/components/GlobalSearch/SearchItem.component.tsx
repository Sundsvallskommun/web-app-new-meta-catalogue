import { useAppContext } from '@contexts/app.context';
import { SearchResult } from '@data-contracts/backend/data-contracts';
import { objectType } from '@services/mdviewer/data-handlers/search';
import { orgHighlightedTableRowProperty, orgTabIndex } from '@services/mdviewer/enums/organization';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useSearchStore } from '@services/mdviewer/search-service';
import { Button, Link, Tag } from '@sk-web-gui/react';
import { findIdInTree } from '@utils/findIdInTree';
import { useRouter } from 'next/router';

export const SearchItem: React.FC<{ item: SearchResult }> = ({ item }) => {
  const router = useRouter();
  const { setHighlightedTableRow } = useAppContext();
  const { setOrganizationTabIndex, setSelectedOrganizationId, orgTree } = useOrganizationStore();
  const searchTerm = useSearchStore((s) => s.searchTerm);
  const { setSearchTerm } = useSearchStore();

  const handleShowOrg = () => {
    setSearchTerm('');
    router
      .push('/')
      .then(() => {
        // find and set company to fix sidebar tree when org is not within the selected company
      })
      .then(() => {
        const org = findIdInTree(orgTree, item.id, 'subItems', 'organizationId');
        if (org) {
          setSelectedOrganizationId(org.id);
        } else {
          setSelectedOrganizationId(null);
        }
      });
  };

  const handleShowInOrg = () => {
    setSearchTerm('');
    router
      .push('/')
      .then(() => {
        // find and set company to fix sidebar tree when org is not within the selected company
      })
      .then(() => {
        setSelectedOrganizationId(item.subId);
      })
      .then(() => {
        setOrganizationTabIndex(orgTabIndex[item.objectType]);
      })
      .then(() => {
        setHighlightedTableRow({
          property: orgHighlightedTableRowProperty[item.objectType],
          value: item.id,
          clickFingerPrint: new Date(),
        });
      });
  };

  const handleShowInOrgAndPerson = () => {
    setSearchTerm('');
    router
      .push('/')
      .then(() => {
        // find and set company to fix sidebar tree when org is not within the selected company
      })
      .then(() => {
        setSelectedOrganizationId(item.subId);
      })
      .then(() => {
        setOrganizationTabIndex(orgTabIndex[item.objectType]);
      })
      .then(() => {
        setHighlightedTableRow({
          property: orgHighlightedTableRowProperty[item.objectType],
          value: item.id,
          showPersonDetails: true,
          clickFingerPrint: new Date(),
        });
      });
  };

  const handleShowInResponsibility = () => {
    setSearchTerm('');
    router.push('/ansvar').then(() => {
      setHighlightedTableRow({
        property: orgHighlightedTableRowProperty[item.objectType],
        value: item.id,
        clickFingerPrint: new Date(),
      });
    });
  };

  const markMatches = (string: string) => {
    const searchRegex = new RegExp('(' + searchTerm + ')', 'ig');
    return string.replace(searchRegex, '<span class="bg-[#B6DCF9]">$1</span>');
  };

  return (
    <div className="flex justify-between py-md px-sm border-b">
      <div className="flex-grow">
        <div className="lg:flex lg:justify-between">
          <div className="lg:pr-lg">
            <div className="flex">
              <div>
                <Tag
                  variant="solid"
                  className={`mr-sm text-body ${objectType(item.objectType).bg} ${objectType(item.objectType).border}`}
                >
                  {objectType(item.objectType).text}
                </Tag>
              </div>
              <div className="text-lg flex-grow font-bold">
                <span dangerouslySetInnerHTML={{ __html: markMatches(item.header) }} />
              </div>
            </div>
            <div className="text-gray-stroke">
              <strong>{`${item.subObjectType == 'ORGANIZATION' ? objectType(item.subObjectType).text + ': ' : ''}${
                item.text ? item.text : ''
              }`}</strong>
            </div>
          </div>
          <div className="flex gap-sm font-bold flex-shrink-0">
            {item.objectType == 'PERSON' && (
              <Button onClick={handleShowInOrgAndPerson} variant="link" className="font-bold">
                <Link as="div">Visa person</Link>
              </Button>
            )}
            {item.objectType == 'ORGANIZATION' && (
              <Button onClick={handleShowOrg} variant="link" className="font-bold">
                <Link as="div">Visa organisation</Link>
              </Button>
            )}
            {item.subObjectType == 'ORGANIZATION' && (
              <Button onClick={handleShowInOrg} variant="link" className="font-bold">
                <Link as="div">Visa i organisation</Link>
              </Button>
            )}
            {item.objectType == 'RESPONSIBILITY' && (
              <Button onClick={handleShowInResponsibility} variant="link" className="font-bold">
                <Link as="div">Visa i ansvar</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
