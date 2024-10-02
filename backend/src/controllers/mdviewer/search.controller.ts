import authMiddleware from '@/middlewares/auth.middleware';
import ApiService from '@/services/api.service';
import { Controller, Get, Param, Req, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import ApiResponse from '@/interfaces/api-service.interface';
import { hasRoles } from '@/middlewares/permissions.middleware';
import { API_PREFIX, API_URL } from './config';
import { SearchResultsApiResponse } from '@/responses/search.response';
import { ObjectSearchResult } from '@/data-contracts/mdviewer/data-contracts';
import { RequestWithUser } from '@/interfaces/auth.interface';

@Controller()
export class MDVSearchController {
  private apiService = new ApiService();

  @Get(`${API_PREFIX}/search/:query/search`)
  @OpenAPI({ summary: 'Return global search results' })
  @ResponseSchema(SearchResultsApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_read']))
  async getCompanyOperations(@Req() req: RequestWithUser, @Param('query') query: string): Promise<ApiResponse<ObjectSearchResult[]>> {
    const { permissions } = req.user;
    const url = `${API_URL}/${query}/search`;
    const res = await this.apiService.get<ObjectSearchResult[]>({ url });

    const data = res.data.filter(x => {
      if (x.objectType == 'RESPONSIBILITY') return permissions.canViewResponsibility;
      if (x.objectType == 'OPERATION') return permissions.canViewOperation;
      return true;
    });

    return { data: data, message: 'success' };
  }
}
