export const apiTestCases = [
  {
    name: 'Ascents',
    endpoint: 'ascents',
    normalize: false,
    size: 0,
  },
  {
    name: 'Normalized ascents',
    endpoint: 'ascents',
    normalize: true,
    size: 0,
  },
  {
    name: 'Training',
    endpoint: 'training',
    normalize: false,
    size: 0,
  },
  {
    name: 'Normalized training',
    endpoint: 'training',
    normalize: true,
    size: 0,
  },
]

export const TEST_PORT = 8001

export const baseURL = `http://localhost:${TEST_PORT}/api`


