import {
  OrgnodeAddDto,
  OrgnodeChangeRespCodeDto,
  OrgnodeCreateDto,
  OrgnodeMoveDto,
  OrgnodeRenameDto,
} from '@data-contracts/backend/data-contracts';

export const handleSendAddNode: (node: OrgnodeAddDto) => OrgnodeAddDto = (node) => ({
  orgId: node.orgId,
  draftId: node.draftId,
});

export const handleSendCreateNode: (body: OrgnodeCreateDto) => OrgnodeCreateDto = (body) => ({
  name: body.name,
  shortName: body.shortName,
  abbreviation: body.abbreviation,
  parentId: body.parentId,
});

export const handleMoveNode: (body: OrgnodeMoveDto) => OrgnodeMoveDto = (body) => ({
  orgId: body.orgId,
  newParentId: body.newParentId,
});

export const handleRenameNode: (body: OrgnodeRenameDto) => OrgnodeRenameDto = (body) => ({
  orgId: body.orgId,
  name: body.name,
  shortName: body.shortName,
  abbreviation: body.abbreviation,
});

export const handleChangeNodeRespCode: (body: OrgnodeChangeRespCodeDto) => OrgnodeChangeRespCodeDto = (body) => ({
  orgId: body.orgId,
  newRespCodePart: body.newRespCodePart,
});
