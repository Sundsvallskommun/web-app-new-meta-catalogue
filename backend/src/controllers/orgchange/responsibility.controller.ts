import authMiddleware from '@/middlewares/auth.middleware';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import ApiService from '@/services/api.service';
import { Body, Controller, Get, HttpCode, Param, Post, Put, QueryParam, Req, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import ApiResponse from '@/interfaces/api-service.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { hasPermissions, hasRoles } from '@/middlewares/permissions.middleware';
import { API_URL, API_PREFIX } from './config';
import { OrgChangeResponsibilitiesApiResponse, OrgChangeResponsibilityNewCodeApiResponse } from '@/responses/orgchange.responsibility.response';
import { Responsibility } from '@/data-contracts/mdbuilder/data-contracts';
import { CloseResponsibilityDto, RenameResponsibilityDto, ResponsibilityCreateDto } from '@/dtos/orgchange/responsibility.dto';

@Controller()
export class OrgChangeResponsibilityController {
  private apiService = new ApiService();

  @Get(`${API_PREFIX}/responsibility/:draftId`)
  @OpenAPI({ summary: 'Return responsibilities for the orgId' })
  @ResponseSchema(OrgChangeResponsibilitiesApiResponse)
  @UseBefore(authMiddleware, hasPermissions(['canViewResponsibility']))
  async getOrgResponsibilities(
    @Req() req: RequestWithUser,
    @Param('draftId') draftId: string,
    @QueryParam('orgId') orgId?: number,
  ): Promise<ApiResponse<Responsibility[]>> {
    const controller = new AbortController();
    req.on('aborted', () => {
      controller.abort();
      req.destroy();
    });
    const url = `${API_URL}/responsibility/${draftId}`;
    return await this.apiService.get<Responsibility[]>({ url, params: { orgId: orgId }, signal: controller.signal });
  }

  @Get(`${API_PREFIX}/responsibility/:responsibilityCodePart/newcode`)
  @OpenAPI({ summary: 'Return responsibilityCode from responsibilityCodePart' })
  @ResponseSchema(OrgChangeResponsibilityNewCodeApiResponse)
  @UseBefore(authMiddleware, hasPermissions(['canEditResponsibility']))
  async getNewCode(
    @Param('responsibilityCodePart') responsibilityCodePart: string,
    @QueryParam('responsibilityType') responsibilityType: string,
  ): Promise<ApiResponse<string>> {
    const url = `${API_URL}/responsibility/${responsibilityCodePart}/newcode`;
    return await this.apiService.get<string>({ url, params: { responsibilityType } });
  }

  @Post(`${API_PREFIX}/responsibility`)
  @OpenAPI({ summary: 'Create responsibility' })
  @HttpCode(204)
  @UseBefore(authMiddleware, hasPermissions(['canEditResponsibility']), validationMiddleware(ResponsibilityCreateDto, 'body'))
  async createResponsibility(@Req() req: RequestWithUser, @Body() body: ResponsibilityCreateDto): Promise<ApiResponse<{}>> {
    const { username } = req.user;
    const url = `${API_URL}/responsibility`;

    return await this.apiService.post({ url, data: { ...body, loginname: username } });
  }

  @Put(`${API_PREFIX}/responsibility/rename`)
  @OpenAPI({ summary: 'Edits the name of a responsibility' })
  @HttpCode(204)
  @UseBefore(authMiddleware, hasPermissions(['canEditResponsibility']), validationMiddleware(RenameResponsibilityDto, 'body'))
  async renameResponsibility(@Req() req: RequestWithUser, @Body() body: RenameResponsibilityDto): Promise<ApiResponse<{}>> {
    const { username } = req.user;
    const url = `${API_URL}/responsibility/rename`;
    return await this.apiService.put({ url, data: { ...body, loginname: username } });
  }

  @Put(`${API_PREFIX}/responsibility/close`)
  @OpenAPI({ summary: 'Closes a responsibility' })
  @HttpCode(204)
  @UseBefore(authMiddleware, hasPermissions(['canEditResponsibility']), validationMiddleware(CloseResponsibilityDto, 'body'))
  async closeResponsibility(@Req() req: RequestWithUser, @Body() body: CloseResponsibilityDto): Promise<ApiResponse<{}>> {
    const { username } = req.user;
    const url = `${API_URL}/responsibility/close`;
    return await this.apiService.put({ url, data: { ...body, loginname: username } });
  }
}
