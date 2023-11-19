// used for unit testing prisma
// for creating, updating, and removing

import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import prisma from './lib/prisma';

jest.mock('./lib/prisma', () => ({
   __esModule: true,
   default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
   mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
