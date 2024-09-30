import authMiddleware from '@/middlewares/auth.middleware';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import ApiService from '@/services/api.service';
import { Body, Controller, Delete, HttpCode, Param, Post, Put, Req, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import ApiResponse from '@/interfaces/api-service.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { hasPermissions, hasRoles } from '@/middlewares/permissions.middleware';
import { API_URL, API_PREFIX } from './config';
import { OrgnodeAddDto, OrgnodeCreateDto, OrgnodeRenameDto, OrgnodeMoveDto, OrgnodeChangeRespCodeDto } from '@/dtos/orgchange/orgnode.dto';

@Controller()
export class OrgChangeOrgNodeController {
  private apiService = new ApiService();

  @Put(`${API_PREFIX}/orgnode/add`)
  @OpenAPI({ summary: 'Add node to draft' })
  @HttpCode(204)
  @UseBefore(authMiddleware, hasPermissions(['canEditOrganizationStructure']), validationMiddleware(OrgnodeAddDto, 'body'))
  async addNode(@Req() req: RequestWithUser, @Body() body: OrgnodeAddDto): Promise<ApiResponse<{}>> {
    const { username } = req.user;
    const url = `${API_URL}/orgnode/add`;
    return await this.apiService.put({ url, data: { ...body, loginname: username } });
  }

  @Put(`${API_PREFIX}/orgnode/:orgId/remove`)
  @OpenAPI({ summary: 'Remove node from draft' })
  @HttpCode(204)
  @UseBefore(authMiddleware, hasPermissions(['canEditOrganizationStructure']))
  async removeNode(@Param('orgId') orgId: string): Promise<ApiResponse<{}>> {
    const url = `${API_URL}/orgnode/${orgId}/remove`;
    return await this.apiService.put({ url });
  }

  @Post(`${API_PREFIX}/orgnode`)
  @OpenAPI({ summary: 'Create node' })
  @UseBefore(authMiddleware, hasPermissions(['canEditOrganizationStructure']), validationMiddleware(OrgnodeCreateDto, 'body'))
  async createNode(@Req() req: RequestWithUser, @Body() body: OrgnodeCreateDto): Promise<ApiResponse<{}>> {
    const { username } = req.user;
    const url = `${API_URL}/orgnode`;
    return await this.apiService.post({ url, data: { ...body, loginname: username } });
  }

  @Delete(`${API_PREFIX}/orgnode/:orgId`)
  @OpenAPI({ summary: 'terminate node' })
  @HttpCode(200)
  @UseBefore(authMiddleware, hasPermissions(['canEditOrganizationStructure']))
  async terminateNode(@Req() req: RequestWithUser, @Param('orgId') orgId: string): Promise<ApiResponse<{}>> {
    const { username } = req.user;
    const url = `${API_URL}/orgnode/${orgId}`;
    return await this.apiService.delete({ url, params: { loginname: username } });
  }

  @Put(`${API_PREFIX}/orgnode/rename`)
  @OpenAPI({ summary: 'Rename node' })
  @HttpCode(204)
  @UseBefore(authMiddleware, hasPermissions(['canEditOrganizationStructure']), validationMiddleware(OrgnodeRenameDto, 'body'))
  async renameNode(@Req() req: RequestWithUser, @Body() body: OrgnodeRenameDto): Promise<ApiResponse<{}>> {
    const { username } = req.user;
    const url = `${API_URL}/orgnode/rename`;
    return await this.apiService.put({ url, data: { ...body, loginname: username } });
  }

  @Put(`${API_PREFIX}/orgnode/move`)
  @OpenAPI({ summary: 'Move node' })
  @HttpCode(204)
  @UseBefore(authMiddleware, hasPermissions(['canEditOrganizationStructure']), validationMiddleware(OrgnodeMoveDto, 'body'))
  async moveNode(@Req() req: RequestWithUser, @Body() body: OrgnodeMoveDto): Promise<ApiResponse<{}>> {
    const { username } = req.user;
    const url = `${API_URL}/orgnode/move`;
    return await this.apiService.put({ url, data: { ...body, loginname: username } });
  }

  @Put(`${API_PREFIX}/orgnode/responsibilitycodepart`)
  @OpenAPI({ summary: 'Change code for node' })
  @HttpCode(204)
  @UseBefore(authMiddleware, hasPermissions(['canEditOrganizationStructure']), validationMiddleware(OrgnodeChangeRespCodeDto, 'body'))
  async changeNodeRespCode(@Req() req: RequestWithUser, @Body() body: OrgnodeChangeRespCodeDto): Promise<ApiResponse<{}>> {
    const { username } = req.user;
    const url = `${API_URL}/orgnode/responsibilitycodepart`;
    return await this.apiService.put({ url, data: { ...body, loginname: username } });
  }

  @Post(`${API_PREFIX}/orgnode/undodelete/:orgId`)
  @OpenAPI({ summary: 'undo delete node' })
  @UseBefore(authMiddleware, hasPermissions(['canEditOrganizationStructure']))
  async undoDelete(@Req() req: RequestWithUser, @Param('orgId') orgId: string): Promise<ApiResponse<{}>> {
    const { username } = req.user;
    const url = `${API_URL}/orgnode/undodelete/${orgId}`;
    return await this.apiService.post({ url, params: { loginname: username } });
  }
}
