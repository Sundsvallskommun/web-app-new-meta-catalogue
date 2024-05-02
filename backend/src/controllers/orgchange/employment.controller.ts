import { EmploymentWithChangeIntent, PersonEmployeeDetail } from '@/data-contracts/mdbuilder/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { hasRoles } from '@/middlewares/permissions.middleware';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import { OrgChangeOrganizationEmployeesApiResponse, OrgChangePersonEmployeeDetailApiResponse } from '@/responses/orgchange.employment.response';
import ApiService from '@/services/api.service';
import { filterPersonNumberString } from '@/utils/filterPersonNumberString';
import { Body, Controller, Get, HttpCode, Param, Put, Req, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { API_PREFIX, API_URL } from './config';
import { EmploymentChangeArrayDto, EmploymentChangeResetArrayDto } from '@/dtos/orgchange/employment.dto';

@Controller()
export class OrgChangeEmploymentController {
  private apiService = new ApiService();

  @Put(`${API_PREFIX}/employment`)
  @OpenAPI({ summary: 'Takes a list of changes. PA-Team, Operation, Organization can be changed independently of eachother' })
  @HttpCode(204)
  @UseBefore(authMiddleware, hasRoles(['meta_admin']), validationMiddleware(EmploymentChangeArrayDto, 'body'))
  async changeEmployment(@Req() req: RequestWithUser, @Body() body: EmploymentChangeArrayDto): Promise<ApiResponse<{}>> {
    const { username } = req.user;
    const url = `${API_URL}/employment`;

    const data = body.people.map(employment => ({
      personId: employment.personId,
      orgId: employment.orgId,
      ...(employment.newActivityId !== undefined && { newActivityId: employment.newActivityId === null ? -1 : employment.newActivityId }),
      ...(employment.newObjectId !== undefined && { newObjectId: employment.newObjectId === null ? -1 : employment.newObjectId }),
      ...(employment.newOperationId !== undefined && { newOperationId: employment.newOperationId === null ? -1 : employment.newOperationId }),
      ...(employment.newPATeam !== undefined && { newPATeam: employment.newPATeam === null ? -1 : employment.newPATeam }),
      ...(employment.newProjectId !== undefined && { newProjectId: employment.newProjectId === null ? -1 : employment.newProjectId }),
      ...(employment.newOrgId !== undefined && { newOrgId: employment.newOrgId === null ? -1 : employment.newOrgId }),
      loginName: username,
    }));

    return await this.apiService.put({ url, data: data });
  }

  @Put(`${API_PREFIX}/employment/reset`)
  @OpenAPI({ summary: 'Resets a changed employment, returns a list of guids' })
  @HttpCode(204)
  @UseBefore(authMiddleware, hasRoles(['meta_admin']), validationMiddleware(EmploymentChangeResetArrayDto, 'body'))
  async resetEmployment(@Req() req: RequestWithUser, @Body() body: EmploymentChangeResetArrayDto): Promise<ApiResponse<{}>> {
    const url = `${API_URL}/employment/reset`;

    return await this.apiService.put({ url, data: body.people });
  }

  @Get(`${API_PREFIX}/employment/:orgId`)
  @OpenAPI({ summary: 'Return employees' })
  @ResponseSchema(OrgChangeOrganizationEmployeesApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']))
  async getEmployees(@Req() req: RequestWithUser, @Param('orgId') orgId: number): Promise<ApiResponse<EmploymentWithChangeIntent[]>> {
    const controller = new AbortController();
    req.on('aborted', () => {
      controller.abort();
      req.destroy();
    });
    const url = `${API_URL}/employment/${orgId}`;
    const res = await this.apiService.get<any>({ url, signal: controller.signal });

    const data =
      res.data.length > 0
        ? res.data.map(x => ({
            ...x,
            personNumber: filterPersonNumberString(x.personNumber),
          }))
        : [];

    return { data: data, message: res.message };
  }

  @Get(`${API_PREFIX}/employment/:personId/detail`)
  @OpenAPI({ summary: 'Return employee details' })
  @ResponseSchema(OrgChangePersonEmployeeDetailApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']))
  async getEmployeeDetails(@Req() req: RequestWithUser, @Param('personId') personId: string): Promise<ApiResponse<PersonEmployeeDetail>> {
    const controller = new AbortController();
    req.on('aborted', () => {
      controller.abort();
      req.destroy();
    });
    const url = `${API_URL}/employment/${personId}/detail`;
    const res = await this.apiService.get<any>({ url, signal: controller.signal });

    const data = res.data
      ? {
          ...res.data,
          personNumber: filterPersonNumberString(res.data.personNumber),
        }
      : [];

    return { data: data, message: res.message };
  }
}
