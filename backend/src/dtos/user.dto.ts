import { UserData } from '@/interfaces/users.interface';
import { IsISO8601 } from 'class-validator';

export class PatchUserSettingsDto implements Partial<UserData> {
  @IsISO8601()
  readCommentsClearedDate: string;
}
