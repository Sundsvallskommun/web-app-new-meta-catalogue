import { Organization, OrganizationTree } from '@/data-contracts/mdviewer/data-contracts';
import { HttpException } from '@/exceptions/HttpException';
import ApiResponse from '@/interfaces/api-service.interface';
import { OrganizationModified, OrganizationTreeModified } from '@/interfaces/organization.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { hasRoles } from '@/middlewares/permissions.middleware';
import { OrganizationApiResponse, OrganizationTreeApiResponse, OrganizationsApiResponse } from '@/responses/organization.response';
import { refitKeys } from '@/utils/refitKeys';
import ApiService from '@services/api.service';
import { Controller, Get, Param, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { API_PREFIX, API_URL } from './config';

const modifyOrganizationModel = <T extends Organization | Organization[]>(data: T) => {
  const newData = refitKeys(
    data,
    new Map([
      ['orgId', 'id'],
      ['treeLevel', 'level'],
    ]),
    'organizations',
    new Map([['label', v => v.orgName]]),
  );

  return newData as OrganizationModified | OrganizationModified[];
};
const modifyOrganizationTreeModel = <T extends OrganizationTree | OrganizationTree[]>(data: T) => {
  const newData = refitKeys(
    data,
    new Map([
      ['orgId', 'id'],
      ['orgDisplayName', 'label'],
      ['treeLevel', 'level'],
      ['organizations', 'subItems'],
    ]),
    'organizations',
  );

  return newData as OrganizationTreeModified | OrganizationTreeModified[];
};

@Controller()
export class MDVOrganizationController {
  private apiService = new ApiService();

  @Get(`${API_PREFIX}/organization/root`)
  @OpenAPI({ summary: 'Return root' })
  @ResponseSchema(OrganizationsApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_read']))
  async index(): Promise<ApiResponse<OrganizationModified[]>> {
    const url = `${API_URL}/root`;
    const params = {};
    const res = await this.apiService.get<Organization[]>({ url, params });

    if (!res.data) {
      throw new HttpException(404, 'Not Found');
    }

    const data = modifyOrganizationModel(res.data) as OrganizationModified[];

    return { data: data, message: 'success' };
  }

  @Get(`${API_PREFIX}/organization/:orgId`)
  @OpenAPI({ summary: 'Return organization by orgId' })
  @ResponseSchema(OrganizationApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_read']))
  async getOrganization(@Param('orgId') orgId: number): Promise<ApiResponse<Organization>> {
    const url = `${API_URL}/${orgId}`;
    const params = {};
    const res = await this.apiService.get<Organization>({ url, params });

    if (!res.data) {
      throw new HttpException(404, 'Not Found');
    }

    const data = modifyOrganizationModel(res.data) as OrganizationModified;

    return { data: data, message: 'success' };
  }

  @Get(`${API_PREFIX}/organization/:orgId/orgtree/:view`)
  @OpenAPI({ summary: 'Return orgtree by view' })
  @ResponseSchema(OrganizationTreeApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_read']))
  async getOrgTree(@Param('orgId') orgId: number, @Param('view') view: number): Promise<ApiResponse<OrganizationTree[]>> {
    const url = `${API_URL}/${orgId}/orgtree`;
    const params = { view: view };

    const res = await this.apiService.get<OrganizationTree>({ url, params });

    if (Array.isArray(res.data) && res.data.length < 1) {
      throw new HttpException(404, 'Not Found');
    }

    const data = modifyOrganizationTreeModel(res.data) as OrganizationTreeModified;

    return { data: [data], message: 'success' };
  }

  @Get(`${API_PREFIX}/organization/:companyId/company`)
  @OpenAPI({ summary: 'Return drafts' })
  @ResponseSchema(OrganizationsApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']))
  async getCompanyOrganizations(@Param('companyId') companyId: string): Promise<ApiResponse<OrganizationModified[]>> {
    const url = `${API_URL}/${companyId}/company`;
    const res = await this.apiService.get<Organization[]>({ url });

    if (!res.data) {
      throw new HttpException(404, 'Not Found');
    }

    const data = modifyOrganizationModel(res.data) as OrganizationModified[];

    return { data: data, message: 'success' };
  }
}
