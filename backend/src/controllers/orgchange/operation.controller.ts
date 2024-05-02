import { Operation, OrganizationOperation } from '@/data-contracts/mdbuilder/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { hasRoles } from '@/middlewares/permissions.middleware';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import { CompanyOperationsApiResponse, OrgChangeOrganizationOperationsApiResponse } from '@/responses/orgchange.operation.response';
import ApiService from '@/services/api.service';
import { Body, Controller, Get, Param, Put, Req, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { API_PREFIX, API_URL } from './config';
import { ConnectOperationDto, DisconnectOperationDto } from '@/dtos/orgchange/operation.dto';

@Controller()
export class OrgChangeOperationController {
  private apiService = new ApiService();

  @Get(`${API_PREFIX}/operation/organization/:orgId`)
  @OpenAPI({ summary: 'Return operations for orgId' })
  @ResponseSchema(OrgChangeOrganizationOperationsApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']))
  async getOrgOperations(@Param('orgId') orgId: number): Promise<ApiResponse<OrganizationOperation[]>> {
    const url = `${API_URL}/operation/organization/${orgId}`;
    return await this.apiService.get<OrganizationOperation[]>({ url });
  }

  @Get(`${API_PREFIX}/operation/:companyId`)
  @OpenAPI({ summary: 'Return operations for companyId' })
  @ResponseSchema(CompanyOperationsApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']))
  async getCompanyOperations(@Param('companyId') companyId: number): Promise<ApiResponse<Operation[]>> {
    const url = `${API_URL}/operation/${companyId}`;
    return await this.apiService.get<Operation[]>({ url });
  }

  @Put(`${API_PREFIX}/operation/connect`)
  @OpenAPI({ summary: 'connect operation to organization' })
  @UseBefore(authMiddleware, hasRoles(['meta_admin']), validationMiddleware(ConnectOperationDto, 'body'))
  async connectOperation(@Req() req: RequestWithUser, @Body() body: ConnectOperationDto): Promise<ApiResponse<{}>> {
    const { username } = req.user;
    const url = `${API_URL}/operation/connect`;

    return await this.apiService.put({ url, data: { ...body, loginName: username } });
  }

  @Put(`${API_PREFIX}/operation/disconnect`)
  @OpenAPI({ summary: 'disconnect operation from organization' })
  @UseBefore(authMiddleware, hasRoles(['meta_admin']), validationMiddleware(DisconnectOperationDto, 'body'))
  async disconnectOperation(@Req() req: RequestWithUser, @Body() body: DisconnectOperationDto): Promise<ApiResponse<{}>> {
    const { username } = req.user;
    const url = `${API_URL}/operation/disconnect`;

    return await this.apiService.put({ url, data: { ...body, loginName: username } });
  }
}
