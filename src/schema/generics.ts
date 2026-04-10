import { z } from 'zod'

export const yearSchema = z.number().int().min(1900).max(2100)
