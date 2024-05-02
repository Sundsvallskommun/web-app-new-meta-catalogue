import { OrgOperation } from '@/data-contracts/mdviewer/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { hasRoles } from '@/middlewares/permissions.middleware';
import { OrgOperationsApiResponse } from '@/responses/mdviewer.operation.response';
import ApiService from '@/services/api.service';
import { Controller, Get, Param, Req, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { API_PREFIX, API_URL } from './config';

@Controller()
export class MDVOperationController {
  private apiService = new ApiService();

  @Get(`${API_PREFIX}/operation/:orgId/operationallleaves`)
  @OpenAPI({ summary: 'Return operations for an organization, descending orgs' })
  @ResponseSchema(OrgOperationsApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_operator']))
  async getCompanyOperations(@Req() req: RequestWithUser, @Param('orgId') orgId: number): Promise<ApiResponse<OrgOperation[]>> {
    const controller = new AbortController();
    req.on('aborted', () => {
      controller.abort();
      req.destroy();
    });
    const url = `${API_URL}/${orgId}/operationallleaves`;
    return await this.apiService.get<OrgOperation[]>({ url, signal: controller.signal });
  }

  @Get(`${API_PREFIX}/operation/:orgId/operation`)
  @OpenAPI({ summary: 'Return operations' })
  @ResponseSchema(OrgOperationsApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_operator']))
  async getOrgOperations(@Param('orgId') orgId: number): Promise<ApiResponse<OrgOperation[]>> {
    const url = `${API_URL}/${orgId}/operation`;
    return await this.apiService.get<OrgOperation[]>({ url });
  }
}
