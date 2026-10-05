export const APIS = [
  {
    name: 'employee',
    version: '2.0',
  },
  {
    name: 'messaging',
    version: '7.11',
  },
  {
    name: 'mdbuilder',
    version: '1.0',
  },
  {
    name: 'mdviewer',
    version: '1.0',
  },
] as const;

type ApiName = (typeof APIS)[number]['name'];

export const getApiBase = (name: ApiName) => {
  const api = APIS.find(api => api.name === name);
  return `${api?.name}/${api?.version}`;
};
