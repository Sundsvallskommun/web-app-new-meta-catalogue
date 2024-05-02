import { OperationConnect, OperationDisconnect } from '@/data-contracts/mdbuilder/data-contracts';
import { IsNumber } from 'class-validator';

export class ConnectOperationDto implements OperationConnect {
  @IsNumber()
  operationId: number;
  @IsNumber()
  orgId: number;
}

export class DisconnectOperationDto implements OperationDisconnect {
  @IsNumber()
  organizationOperationId: number;
}
