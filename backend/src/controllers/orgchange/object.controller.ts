import { Object } from '@/data-contracts/mdbuilder/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { hasPermissions } from '@/middlewares/permissions.middleware';
import { CompanyObjectsApiResponse } from '@/responses/orgchange.object.response';
import ApiService from '@/services/api.service';
import { Controller, Get, Param, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { API_PREFIX, API_URL } from './config';

@Controller()
export class OrgChangeObjectController {
  private apiService = new ApiService();

  @Get(`${API_PREFIX}/object/:companyId`)
  @OpenAPI({ summary: 'Return objects for companyId' })
  @ResponseSchema(CompanyObjectsApiResponse)
  @UseBefore(authMiddleware, hasPermissions(['canViewDrafts']))
  async getCompanyObjects(@Param('companyId') companyId: number): Promise<ApiResponse<Object[]>> {
    const url = `${API_URL}/object/${companyId}`;
    return await this.apiService.get<Object[]>({ url });
  }
}
