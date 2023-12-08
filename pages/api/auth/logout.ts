import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

// logging out should be
// this is an api page NOT a componet page
// why is logout api necessary for?
