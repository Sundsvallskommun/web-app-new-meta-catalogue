import { VerifyResult } from '../../../src/data-contracts/backend/data-contracts';

export const emptyVerifyResult: VerifyResult = {
  numberOfValidationErrors: 0,
  missingParent: [],
  noChildren: [],
};
