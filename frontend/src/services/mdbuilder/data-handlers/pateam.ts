import { PATeamAndManager, PATeamSearchResult } from '@data-contracts/backend/data-contracts';
import { ApiResponse } from '@services/api-service';

export const handleGetPaTeamResults: (res: ApiResponse<PATeamSearchResult[]>) => PATeamSearchResult[] = (res) => {
  return res.data.map((data) => ({
    managerId: data.managerId,
    paTeam: data.paTeam,
    paTeamName: data.paTeamName,
    managerName: data.managerName,
  }));
};

export const handleGetPaTeamsByManager: (res: ApiResponse<PATeamAndManager[]>) => PATeamAndManager[] = (res) => {
  return res.data.map((data) => ({
    managerId: data.managerId,
    paTeam: data.paTeam,
    paTeamName: data.paTeamName,
    managerName: data.managerName,
    employeeImage: data.employeeImage,
  }));
};
