import { Body, Controller, Delete, Get, OnUndefined, Param, Patch, Post, Req, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { HttpException } from '@/exceptions/HttpException';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import ApiResponse from '@/interfaces/api-service.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { AlertBannerMessage } from '@/interfaces/alert-banner.interface';
import { AlertBannerDto } from '@/dtos/alert-banner.dto';
import prisma from '@/utils/prisma';
import { hasRoles } from '@/middlewares/permissions.middleware';
import { AlertBannerMessageApiResponse, AlertBannerMessageDeleteApiResponse } from '@/responses/alert.response';

@Controller()
export class AlertController {
  @Get('/alert')
  @OpenAPI({ summary: 'Get alert-banner-message' })
  @ResponseSchema(AlertBannerMessageApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_read']))
  async getAlert(@Req() req: RequestWithUser): Promise<ApiResponse<AlertBannerMessage>> {
    const { name } = req.user;

    if (!name) {
      throw new HttpException(400, 'Bad Request');
    }

    const alertMessages = await prisma.alertMessage.findMany();

    if (Array.isArray(alertMessages) && alertMessages.length < 1) {
      throw new HttpException(404, 'Not Found');
    }

    return { data: alertMessages[0], message: 'success' };
  }

  @Post('/alert')
  @OnUndefined(204)
  @OpenAPI({ summary: 'Create new alert' })
  @ResponseSchema(AlertBannerMessageApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_admin']), validationMiddleware(AlertBannerDto, 'body'))
  async newAlert(@Req() req: RequestWithUser, @Body() messageData: AlertBannerDto): Promise<ApiResponse<AlertBannerMessage>> {
    const { name } = req.user;

    if (!name) {
      throw new HttpException(400, 'Bad Request');
    }

    const alertMessage = await prisma.alertMessage.create({
      data: {
        ...messageData,
      },
    });

    return { data: alertMessage, message: 'updated' };
  }

  @Patch('/alert/:id')
  @OnUndefined(204)
  @OpenAPI({ summary: 'Edit an alert' })
  @ResponseSchema(AlertBannerMessageApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_admin']), validationMiddleware(AlertBannerDto, 'body'))
  async editAlert(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
    @Body() messageData: AlertBannerDto,
  ): Promise<ApiResponse<AlertBannerMessage>> {
    const { username } = req.user;

    if (!username) {
      throw new HttpException(400, 'Bad Request');
    }

    const alertMessage = await prisma.alertMessage.update({
      where: {
        id: id,
      },
      data: {
        ...messageData,
      },
    });

    return { data: alertMessage, message: 'updated' };
  }

  @Delete('/alert/:id')
  @OnUndefined(204)
  @OpenAPI({ summary: 'Delete an alert' })
  @ResponseSchema(AlertBannerMessageDeleteApiResponse)
  @UseBefore(authMiddleware, hasRoles(['meta_admin']))
  async deleteAlert(@Req() req: RequestWithUser, @Param('id') id: number) {
    const { username } = req.user;

    if (!username) {
      throw new HttpException(400, 'Bad Request');
    }

    try {
      await prisma.alertMessage.delete({
        where: {
          id: id,
        },
      });
      return { message: 'deleted' };
    } catch (error) {
      return { message: 'is deleted' };
    }
  }
}
