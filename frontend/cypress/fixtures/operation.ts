import { OrgOperation } from '../../src/data-contracts/backend/data-contracts';
import { ApiResponse } from '../../src/services/api-service';

export const operations: ApiResponse<OrgOperation[]> = {
  data: [
    {
      orgOperationId: '2d43d023-ae5f-4686-84f4-7a8412f694e8',
      orgId: 797,
      operationCode: '407000',
      operationDescription: 'Förskola',
    },
    {
      orgOperationId: 'a94cd787-17ee-4cc6-ae4d-f7dc1fe21f91',
      orgId: 179,
      operationCode: '425000',
      operationDescription: 'Fritidshem',
    },
    {
      orgOperationId: '7ff6d27f-e87d-4ee6-868b-304e57da453e',
      orgId: 183,
      operationCode: '425100',
      operationDescription: 'Särskolefritids',
    },
    {
      orgOperationId: '3b1b6929-ceb5-4159-b8e2-ca0c9078e7fb',
      orgId: 183,
      operationCode: '425200',
      operationDescription: 'Träningsskolefritids',
    },
    {
      orgOperationId: '02238beb-8d09-440a-8cde-cf63212cfdd8',
      orgId: 179,
      operationCode: '435000',
      operationDescription: 'Förskoleklass',
    },
    {
      orgOperationId: '014c8ed3-96a1-4b91-9813-e26180b4d1a9',
      orgId: 179,
      operationCode: '440000',
      operationDescription: 'Grundskola',
    },
    {
      orgOperationId: '8528226a-5699-416e-b1ed-f5bf24ac1feb',
      orgId: 183,
      operationCode: '440100',
      operationDescription: 'Särskilda undervisningsgrupper',
    },
    {
      orgOperationId: '603cc8a4-ac04-40e6-8a37-217942a0f0f7',
      orgId: 179,
      operationCode: '440200',
      operationDescription: 'Asyl, introduktion och interna',
    },
    {
      orgOperationId: 'faf0ed90-b8d0-4079-a496-09ce7114d4fb',
      orgId: 180,
      operationCode: '443000',
      operationDescription: 'Grundsärskola',
    },
    {
      orgOperationId: '03fe02f5-be2b-460d-a4d9-884a1385ef8c',
      orgId: 180,
      operationCode: '443100',
      operationDescription: 'Träningsskola',
    },
    {
      orgOperationId: '4f4a5a5c-f518-483e-8e03-f49aa2859ba7',
      orgId: 797,
      operationCode: '460000',
      operationDescription: 'Övergripande funktioner',
    },
    {
      orgOperationId: '5c8db13b-63a7-4810-a512-86b225f57fa2',
      orgId: 199,
      operationCode: '460020',
      operationDescription: 'Modersmålsundervisning',
    },
    {
      orgOperationId: '8c3298cf-0a5b-4326-9c28-ca5080334fc7',
      orgId: 183,
      operationCode: '460030',
      operationDescription: 'Sjukhusundervisning',
    },
    {
      orgOperationId: '652d242f-92ee-467e-85dc-44399aa48db8',
      orgId: 797,
      operationCode: '461000',
      operationDescription: 'Skolområden',
    },
    {
      orgOperationId: '2cbe863c-4c4e-4d8c-8f79-121f7b85ec1c',
      orgId: 199,
      operationCode: '463000',
      operationDescription: 'Barn och utbildningskontoret',
    },
  ],
  message: 'success',
};
