import OrganizationTabs from '@components/Organization/OrganizationTabs/OrganizationTabs.component';
import OrgNameEdit from '@components/Organization/OrgNameEdit/OrgNameEdit.component';
import { useOrganizationStore } from '@services/mdviewer/organization-service';

export default function Organization({ isEdit = false }) {
  const organization = useOrganizationStore((s) => s.organization);
  const orgTree = useOrganizationStore((s) => s.orgTree);

  return (
    <>
      {organization && organization?.id !== null ? (
        <section className="bg-white h-full">
          <OrgNameEdit
            newItem={false}
            organization={organization}
            orgChangeOrg={undefined}
            orgTree={orgTree}
            isEdit={isEdit}
          />
          <OrganizationTabs organization={organization} />
        </section>
      ) : (
        <div className="w-full pt-lg h-full flex justify-center">
          <div>Ingen organisation vald.</div>
        </div>
      )}
    </>
  );
}
