import { OrganizationResponsibility } from '@/data-contracts/mdviewer/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { hasPermissions } from '@/middlewares/permissions.middleware';
import { ResponsibilitiesApiResponse } from '@/responses/mdviewer.responsibility.response';
import ApiService from '@/services/api.service';
import { Controller, Get, Param, Req, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { API_PREFIX, API_URL } from './config';

@Controller()
export class MDVResponsibilityController {
  private apiService = new ApiService();

  @Get(`${API_PREFIX}/responsibility/:companyId/responsibilitysallcompany`)
  @OpenAPI({ summary: 'Return responsibilities for a company' })
  @ResponseSchema(ResponsibilitiesApiResponse)
  @UseBefore(authMiddleware, hasPermissions(['canViewResponsibility']))
  async index(@Req() req: RequestWithUser, @Param('companyId') companyId: number): Promise<ApiResponse<OrganizationResponsibility[]>> {
    const controller = new AbortController();
    req.on('aborted', () => {
      controller.abort();
      req.destroy();
    });
    const url = `${API_URL}/${companyId}/responsibilitysallcompany`;
    return await this.apiService.get<OrganizationResponsibility[]>({ url, signal: controller.signal });
  }

  @Get(`${API_PREFIX}/responsibility/:orgId/responsibilitysallleaves`)
  @OpenAPI({ summary: 'Return responsibilities for an organization, descending orgs' })
  @ResponseSchema(ResponsibilitiesApiResponse)
  @UseBefore(authMiddleware, hasPermissions(['canViewResponsibility']))
  async getCompanyResponsibilities(@Req() req: RequestWithUser, @Param('orgId') orgId: number): Promise<ApiResponse<OrganizationResponsibility[]>> {
    const controller = new AbortController();
    req.on('aborted', () => {
      controller.abort();
      req.destroy();
    });
    const url = `${API_URL}/${orgId}/responsibilitysallleaves`;
    return await this.apiService.get<OrganizationResponsibility[]>({ url, signal: controller.signal });
  }

  @Get(`${API_PREFIX}/responsibility/:orgId/responsibilities`)
  @OpenAPI({ summary: 'Return responsibilities' })
  @ResponseSchema(ResponsibilitiesApiResponse)
  @UseBefore(authMiddleware, hasPermissions(['canViewResponsibility']))
  async getOrgResponsibilities(@Req() req: RequestWithUser, @Param('orgId') orgId: number): Promise<ApiResponse<OrganizationResponsibility[]>> {
    const controller = new AbortController();
    req.on('aborted', () => {
      controller.abort();
      req.destroy();
    });
    const url = `${API_URL}/${orgId}/responsibilitys`;
    return await this.apiService.get<OrganizationResponsibility[]>({ url, signal: controller.signal });
  }
}
