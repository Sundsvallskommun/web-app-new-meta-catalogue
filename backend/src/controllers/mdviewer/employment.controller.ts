import { RequestWithUser } from '@/interfaces/auth.interface';
import ApiResponse from '@/interfaces/api-service.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { hasRoles } from '@/middlewares/permissions.middleware';
import ApiService from '@/services/api.service';
import { filterPersonNumberString } from '@/utils/filterPersonNumberString';
import { Controller, Get, Param, Req, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { API_URL, API_PREFIX } from './config';
import { MDVEmployee } from '@/data-contracts/mdviewer/data-contracts';
import { EmployeeDetailsApiResponse, EmployeesApiResponse } from '@/responses/mdviewer.employment.response';

const modifyPersonNumber = (data: MDVEmployee[]) => {
  if (!data) return;
  if (Array.isArray(data)) {
    return data.map(x => ({
      ...x,
      personNumber: filterPersonNumberString(x.personNumber),
    }));
  } else {
    return Object.assign(data, { personNumber: filterPersonNumberString((data as MDVEmployee).personNumber) });
  }
};

@Controller()
export class MDVEmployeeController {
  private apiService = new ApiService();
  @Get(`${API_PREFIX}/employment/:orgId/employees`)
  @OpenAPI({ summary: 'Return employees' })
  @ResponseSchema(EmployeesApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_read']))
  async getEmployee(@Req() req: RequestWithUser, @Param('orgId') orgId: number): Promise<ApiResponse<MDVEmployee[]>> {
    const controller = new AbortController();
    req.on('aborted', () => {
      controller.abort();
      req.destroy();
    });
    const url = `${API_URL}/${orgId}/employees`;
    const res = await this.apiService.get<any>({ url, signal: controller.signal });

    const data = modifyPersonNumber(res.data);

    return { data: data, message: res.message };
  }

  @Get(`${API_PREFIX}/employment/:orgId/employeesallleaves`)
  @OpenAPI({ summary: 'Return employees for an organization, descending orgs' })
  @ResponseSchema(EmployeesApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_read']))
  async getCompanyResponsibilities(@Req() req: RequestWithUser, @Param('orgId') orgId: number): Promise<ApiResponse<MDVEmployee[]>> {
    const controller = new AbortController();
    req.on('aborted', () => {
      controller.abort();
      req.destroy();
    });

    const url = `${API_URL}/${orgId}/employeesallleaves`;
    const res = await this.apiService.get<any>({ url, signal: controller.signal });

    const data = modifyPersonNumber(res.data);

    return { data: data, message: res.message };
  }

  @Get(`${API_PREFIX}/employment/:personId/employeedetails`)
  @OpenAPI({ summary: 'Return employeedetails' })
  @ResponseSchema(EmployeeDetailsApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_operator']))
  async getEmployeeDetails(@Req() req: RequestWithUser, @Param('personId') personId: string): Promise<ApiResponse<MDVEmployee[]>> {
    const controller = new AbortController();
    req.on('aborted', () => {
      controller.abort();
      req.destroy();
    });
    const url = `${API_URL}/${personId}/employeedetails`;
    const res = await this.apiService.get<any>({ url, signal: controller.signal });

    const data = modifyPersonNumber(res.data);

    return { data: data, message: res.message };
  }
}
