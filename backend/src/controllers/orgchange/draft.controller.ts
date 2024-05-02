import { Draft, Runbook } from '@/data-contracts/mdbuilder/data-contracts';
import {
  DraftChangeCutOffDateDto,
  DraftChangePhaseDto,
  DraftRenameDto,
  NewDraftDto,
  PostDraftCommentDto,
  RunBookActionTriggerDto,
} from '@/dtos/orgchange/draft.dto';
import ApiResponse from '@/interfaces/api-service.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { DraftTree } from '@/interfaces/orgchange.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { hasRoles } from '@/middlewares/permissions.middleware';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import {
  DraftComment,
  DraftCommentsApiResponse,
  DraftRunbookApiResponse,
  DraftVerifyApiResponse,
  OrgChangeDraftApiResponse,
  OrgChangeDraftTreeApiResponse,
  OrgChangeDraftsApiResponse,
  VerifyResult,
} from '@/responses/orgchange.draft.response';
import ApiService from '@/services/api.service';
import { refitKeys } from '@/utils/refitKeys';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { API_PREFIX, API_URL } from './config';

@Controller()
export class OrgChangeDraftController {
  private apiService = new ApiService();

  @Post(`${API_PREFIX}/draft`)
  @OpenAPI({ summary: 'Create new draft' })
  @UseBefore(authMiddleware, hasRoles(['meta_admin']), validationMiddleware(NewDraftDto, 'body'))
  async newDraft(@Req() req: RequestWithUser, @Body() body: NewDraftDto): Promise<ApiResponse<string>> {
    const { username } = req.user;
    const url = `${API_URL}/draft`;
    return await this.apiService.post<string>({ url, data: { ...body, loginname: username } });
  }

  @Get(`${API_PREFIX}/drafts`)
  @OpenAPI({ summary: 'Return drafts' })
  @ResponseSchema(OrgChangeDraftsApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']))
  async getDrafts(): Promise<ApiResponse<Draft[]>> {
    const url = `${API_URL}/drafts`;
    return await this.apiService.get<Draft[]>({ url });
  }

  @Get(`${API_PREFIX}/draft/:draftId`)
  @OpenAPI({ summary: 'Return specific draft' })
  @ResponseSchema(OrgChangeDraftApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']))
  async getDraft(@Param('draftId') draftId: string): Promise<ApiResponse<Draft>> {
    const url = `${API_URL}/draft/${draftId}`;
    return await this.apiService.get<Draft>({ url });
  }

  @Delete(`${API_PREFIX}/draft/:draftId`)
  @OpenAPI({ summary: 'delete draft' })
  @HttpCode(204)
  @UseBefore(authMiddleware, hasRoles(['meta_admin']))
  async deleteDraft(@Param('draftId') draftId: string): Promise<ApiResponse<string>> {
    const url = `${API_URL}/draft/${draftId}`;
    return await this.apiService.delete<string>({ url });
  }

  @Put(`${API_PREFIX}/draft/:draftId/rename`)
  @OpenAPI({ summary: 'Edit draft names' })
  @HttpCode(204)
  @UseBefore(authMiddleware, hasRoles(['meta_admin']), validationMiddleware(DraftRenameDto, 'body'))
  async draftRename(@Param('draftId') draftId: string, @Body() body: DraftRenameDto): Promise<ApiResponse<Draft>> {
    const url = `${API_URL}/draft/${draftId}/rename`;
    return await this.apiService.put({ url, params: { name: body.name } });
  }

  @Put(`${API_PREFIX}/draft/:draftId/cutoffdate`)
  @OpenAPI({ summary: 'Edit draft cutoff date' })
  @HttpCode(204)
  @UseBefore(authMiddleware, hasRoles(['meta_admin']), validationMiddleware(DraftChangeCutOffDateDto, 'body'))
  async draftEditCutOffDate(@Param('draftId') draftId: string, @Body() body: DraftChangeCutOffDateDto): Promise<ApiResponse<Draft>> {
    const url = `${API_URL}/draft/${draftId}/cutoffdate`;
    return await this.apiService.put({ url, params: { cutOffDate: body.cutOffDate } });
  }

  @Put(`${API_PREFIX}/draft/:draftId/phase`)
  @OpenAPI({ summary: 'Edit draft phase' })
  @HttpCode(204)
  @UseBefore(authMiddleware, hasRoles(['meta_admin']), validationMiddleware(DraftChangePhaseDto, 'body'))
  async draftEditPhase(@Param('draftId') draftId: string, @Body() body: DraftChangePhaseDto): Promise<ApiResponse<Draft>> {
    const url = `${API_URL}/draft/${draftId}/phase`;
    return await this.apiService.put({ url, params: { phase: body.phase } });
  }

  @Get(`${API_PREFIX}/draft/:draftId/tree`)
  @OpenAPI({ summary: 'Return draft tree' })
  @ResponseSchema(OrgChangeDraftTreeApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']))
  async getDraftTree(@Param('draftId') draftId: string): Promise<ApiResponse<DraftTree[]>> {
    const url = `${API_URL}/draft/${draftId}/tree`;
    const res = await this.apiService.get<DraftTree[]>({ url });

    const newtree: DraftTree[] = refitKeys(
      res.data,
      new Map<string, string | any>([
        ['orgId', 'id'],
        ['name', 'orgName'],
        ['shortName', 'orgNameShort'],
        ['displayName', 'label'],
        ['treeLevel', 'level'],
        ['branches', 'subItems'],
        ['responsibilityCodePart', 'responsibilityCode'],
        ['responsibilityCodePartList', 'responsibilityList'],
      ]),
      'branches',
    );

    return { data: newtree, message: 'success' };
  }

  @Get(`${API_PREFIX}/draft/comments/:draftId`)
  @OpenAPI({ summary: 'Return draft comments' })
  @ResponseSchema(DraftCommentsApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']))
  async getDraftComments(@Param('draftId') draftId: string): Promise<ApiResponse<DraftComment[]>> {
    const url = `${API_URL}/draft/comments/${draftId}`;
    return await this.apiService.get<DraftComment[]>({ url });
  }

  @Post(`${API_PREFIX}/draft/comment`)
  @OpenAPI({ summary: 'Create new comment' })
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']), validationMiddleware(PostDraftCommentDto, 'body'))
  async postComment(@Req() req: RequestWithUser, @Body() body: PostDraftCommentDto): Promise<ApiResponse<string>> {
    const { username } = req.user;
    const url = `${API_URL}/draft/comment`;
    return await this.apiService.post<string>({ url, data: { ...body, loginname: username } });
  }

  @Put(`${API_PREFIX}/draft/comment/:draftCommentId`)
  @OpenAPI({ summary: 'edit comment' })
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']))
  async editComment(@Param('draftCommentId') draftCommentId: string, @Body() body: { comment: string }): Promise<ApiResponse<string>> {
    const url = `${API_URL}/draft/comment/${draftCommentId}`;
    return await this.apiService.put<string>({ url, params: { comment: body.comment } });
  }

  @Delete(`${API_PREFIX}/draft/comment/:draftCommentId`)
  @OpenAPI({ summary: 'delete comment' })
  @HttpCode(204)
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']))
  async deleteComment(@Param('draftCommentId') draftCommentId: string): Promise<ApiResponse<string>> {
    const url = `${API_URL}/draft/comment/${draftCommentId}`;
    return await this.apiService.delete<string>({ url });
  }

  // verify
  @Get(`${API_PREFIX}/draft/:draftId/verify`)
  @OpenAPI({ summary: 'Return draft comments' })
  @ResponseSchema(DraftVerifyApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']))
  async verifyDraft(@Param('draftId') draftId: string): Promise<ApiResponse<VerifyResult>> {
    const url = `${API_URL}/draft/${draftId}/verify`;
    return await this.apiService.get<VerifyResult>({ url });
  }

  // runbook
  @Post(`${API_PREFIX}/draft/trigger`)
  @OpenAPI({ summary: 'Trigger runbook action' })
  @HttpCode(202)
  @UseBefore(authMiddleware, hasRoles(['meta_admin']), validationMiddleware(RunBookActionTriggerDto, 'body'))
  async triggerRunBookAction(@Req() req: RequestWithUser, @Body() body: RunBookActionTriggerDto): Promise<ApiResponse<string>> {
    const { username } = req.user;
    const url = `${API_URL}/draft/trigger`;
    return await this.apiService.post<string>({ url, data: { ...body, loginname: username } });
  }

  @Get(`${API_PREFIX}/draft/:draftId/runbook`)
  @OpenAPI({ summary: 'Return runbook' })
  @ResponseSchema(DraftRunbookApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_verifier']))
  async getRunbook(@Param('draftId') draftId: string): Promise<ApiResponse<Runbook>> {
    const url = `${API_URL}/draft/${draftId}/runbook`;
    return await this.apiService.get<Runbook>({ url });
  }
}
