import { Project } from '@/data-contracts/mdbuilder/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { hasRoles } from '@/middlewares/permissions.middleware';
import { CompanyProjectsApiResponse } from '@/responses/orgchange.project.response';
import ApiService from '@/services/api.service';
import { Controller, Get, Param, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { API_PREFIX, API_URL } from './config';

@Controller()
export class OrgChangeProjectController {
  private apiService = new ApiService();

  @Get(`${API_PREFIX}/project/:companyId`)
  @OpenAPI({ summary: 'Return projects for companyId' })
  @ResponseSchema(CompanyProjectsApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']))
  async getCompanyProjects(@Param('companyId') companyId: number): Promise<ApiResponse<Project[]>> {
    const url = `${API_URL}/project/${companyId}`;
    return await this.apiService.get<Project[]>({ url });
  }
}
