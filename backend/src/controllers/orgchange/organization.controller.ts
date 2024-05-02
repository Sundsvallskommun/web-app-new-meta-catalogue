import authMiddleware from '@/middlewares/auth.middleware';
import ApiService from '@/services/api.service';
import { Controller, Get, Param, QueryParam, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import ApiResponse from '@/interfaces/api-service.interface';
import { hasRoles } from '@/middlewares/permissions.middleware';
import { API_PREFIX, API_URL } from './config';
import { CheckedOutOrganizationLevel2ApiResponse, InitialOrgStructuresToExporApiResponse } from '@/responses/orgchange.organization';
import { OrganizationExport, OrganizationLevel2 } from '@/data-contracts/mdbuilder/data-contracts';

@Controller()
export class OrgChangeInitialOrganizationExportController {
  private apiService = new ApiService();

  @Get(`${API_PREFIX}/organization`)
  @OpenAPI({ summary: 'Return InitialOrgStructureToExport for org level 2' })
  @ResponseSchema(InitialOrgStructuresToExporApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']))
  async getInitialOrgStructuresToExport(@QueryParam('orgIds') orgIdsString: string): Promise<ApiResponse<OrganizationExport[]>> {
    const orgIds = orgIdsString.split(',');
    const orgArr = [];
    await Promise.all(
      orgIds.map(async orgId => {
        const url = `${API_URL}/organization/${orgId}`;
        const res = await this.apiService.get<OrganizationExport[]>({ url });
        if (res.data) {
          orgArr.push(res.data);
        }
      }),
    );
    return { data: orgArr, message: 'success' };
  }

  @Get(`${API_PREFIX}/organization/organizationlevel2/:draftId`)
  @OpenAPI({ summary: 'Return InitialCheckedOutBranches' })
  @ResponseSchema(CheckedOutOrganizationLevel2ApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']))
  async getInitialCheckedOutBranches(@Param('draftId') draftId: string): Promise<ApiResponse<OrganizationLevel2[]>> {
    const url = `${API_URL}/organizationlevel2/${draftId}`;
    return await this.apiService.get<OrganizationLevel2[]>({ url });
  }
}
