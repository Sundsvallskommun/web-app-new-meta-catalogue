import { PatchUserSettingsDto } from '@/dtos/user.dto';
import { HttpException } from '@/exceptions/HttpException';
import ApiResponse from '@/interfaces/api-service.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { UserData } from '@/interfaces/users.interface';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import { UserApiResponse } from '@/responses/user.response';
import authMiddleware from '@middlewares/auth.middleware';
import prisma from '@utils/prisma';
import { Body, Controller, Get, Patch, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@Controller()
export class UserController {
  @Get('/me')
  @OpenAPI({
    summary: 'Return current user',
  })
  @ResponseSchema(UserApiResponse)
  @UseBefore(authMiddleware)
  async getUser(@Req() req: RequestWithUser, @Res() response: any): Promise<ApiResponse<UserData>> {
    const { name, username, permissions, role } = req.user;

    if (!username) {
      throw new HttpException(400, 'Bad Request');
    }

    let userSettings = await prisma.userSettings.findFirst({
      where: {
        userId: req.user.personId,
      },
    });

    if (!userSettings) {
      userSettings = await prisma.userSettings.create({
        data: {
          userId: req.user.personId,
        },
      });
    }

    userSettings && delete userSettings.id;
    userSettings && delete userSettings.userId;

    const userData: UserData = {
      name: name,
      username: username,
      role: role,
      permissions: permissions,
      readCommentsClearedDate: userSettings.readCommentsClearedDate?.toISOString() || null,
    };

    return response.send({ data: userData, message: 'success' });
  }

  @Patch('/me')
  @OpenAPI({ summary: 'Patch user settings' })
  @ResponseSchema(UserApiResponse)
  @UseBefore(authMiddleware, validationMiddleware(PatchUserSettingsDto, 'body'))
  async patchSettings(@Req() req: RequestWithUser, @Body() userData: PatchUserSettingsDto, @Res() response: any): Promise<void> {
    const { personId, name, username, permissions, role } = req.user;

    const newSettings = await prisma.userSettings.update({
      where: {
        userId: personId,
      },
      data: {
        readCommentsClearedDate: userData.readCommentsClearedDate,
      },
    });

    newSettings && delete newSettings.id;
    newSettings && delete newSettings.userId;

    const newUserData: UserData = {
      name: name,
      username: username,
      role: role,
      permissions: permissions,
      readCommentsClearedDate: newSettings.readCommentsClearedDate?.toISOString() || null,
    };

    return response.send({ data: newUserData, message: 'success' });
  }
}
