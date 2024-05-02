import { Activity } from '@/data-contracts/mdbuilder/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { hasRoles } from '@/middlewares/permissions.middleware';
import { CompanyActivitysApiResponse } from '@/responses/orgchange.activity.response';
import ApiService from '@/services/api.service';
import { Controller, Get, Param, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { API_PREFIX, API_URL } from './config';

@Controller()
export class OrgChangeActivityController {
  private apiService = new ApiService();

  @Get(`${API_PREFIX}/activity/:companyId`)
  @OpenAPI({ summary: 'Return activities for companyId' })
  @ResponseSchema(CompanyActivitysApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']))
  async getCompanyActivitys(@Param('companyId') companyId: number): Promise<ApiResponse<Activity[]>> {
    const url = `${API_URL}/activity/${companyId}`;
    return await this.apiService.get<Activity[]>({ url });
  }
}
