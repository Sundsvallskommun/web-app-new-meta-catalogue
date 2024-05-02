import authMiddleware from '@/middlewares/auth.middleware';
import ApiService from '@/services/api.service';
import { Controller, Get, QueryParam, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import ApiResponse from '@/interfaces/api-service.interface';
import { hasRoles } from '@/middlewares/permissions.middleware';
import { API_URL, API_PREFIX } from './config';
import { PATeamAndManagersApiResponse, PATeamSearchResultsApiResponse } from '@/responses/orgchange.pateam.response';
import { PATeamAndManager, PATeamSearchResult } from '@/data-contracts/mdbuilder/data-contracts';

@Controller()
export class OrgChangePATeamController {
  private apiService = new ApiService();

  // Pa-team
  @Get(`${API_PREFIX}/pateam/search`)
  @OpenAPI({ summary: 'Return PA-Team search results' })
  @ResponseSchema(PATeamSearchResultsApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_admin']))
  async getPaTeamResults(@QueryParam('query') query: string): Promise<ApiResponse<PATeamSearchResult[]>> {
    const url = `${API_URL}/pateam/search`;
    return await this.apiService.get<PATeamSearchResult[]>({ url, params: { searchString: query } });
  }

  @Get(`${API_PREFIX}/pateam`)
  @OpenAPI({ summary: 'Return PA-Teams by manager' })
  @ResponseSchema(PATeamAndManagersApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_admin']))
  async getPaTeamsByManager(@QueryParam('managerId') managerId: string): Promise<ApiResponse<PATeamAndManager[]>> {
    const url = `${API_URL}/pateam`;
    return await this.apiService.get<PATeamAndManager[]>({ url, params: { managerId: managerId } });
  }
}
