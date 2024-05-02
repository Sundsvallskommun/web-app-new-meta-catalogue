import { IsArray } from 'class-validator';

export class InitialOrgStructureToExportDto {
  @IsArray()
  orgIds: number[];
}
