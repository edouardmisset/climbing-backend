import { ascentSchema } from 'schema/ascent.ts'
import { trainingSessionSchema } from 'schema/training.ts'
import ascents from './ascent-data-sample.json' with { type: 'json' }
import training from './training-data-sample.json' with {
  type: 'json',
}

export const sampleAscents = ascentSchema.array().parse(ascents)

export const sampleTrainingSessions = trainingSessionSchema.array().parse(
  training,
)
