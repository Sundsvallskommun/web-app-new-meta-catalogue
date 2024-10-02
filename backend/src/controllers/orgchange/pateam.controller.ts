import { PATeamAndManager, PATeamSearchResult } from '@/data-contracts/mdbuilder/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { hasPermissions } from '@/middlewares/permissions.middleware';
import { PATeamAndManagersApiResponse, PATeamSearchResultsApiResponse } from '@/responses/orgchange.pateam.response';
import ApiService from '@/services/api.service';
import { Controller, Get, QueryParam, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { API_PREFIX, API_URL } from './config';

@Controller()
export class OrgChangePATeamController {
  private apiService = new ApiService();

  // Pa-team
  @Get(`${API_PREFIX}/pateam/search`)
  @OpenAPI({ summary: 'Return PA-Team search results' })
  @ResponseSchema(PATeamSearchResultsApiResponse)
  @UseBefore(authMiddleware, hasPermissions(['canViewDrafts']))
  async getPaTeamResults(@QueryParam('query') query: string): Promise<ApiResponse<PATeamSearchResult[]>> {
    const url = `${API_URL}/pateam/search`;
    return await this.apiService.get<PATeamSearchResult[]>({ url, params: { searchString: query } });
  }

  @Get(`${API_PREFIX}/pateam`)
  @OpenAPI({ summary: 'Return PA-Teams by manager' })
  @ResponseSchema(PATeamAndManagersApiResponse)
  @UseBefore(authMiddleware, hasPermissions(['canViewDrafts']))
  async getPaTeamsByManager(@QueryParam('managerId') managerId: string): Promise<ApiResponse<PATeamAndManager[]>> {
    const url = `${API_URL}/pateam`;
    return await this.apiService.get<PATeamAndManager[]>({ url, params: { managerId: managerId } });
  }
}
