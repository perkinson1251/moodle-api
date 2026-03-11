import { asClass } from 'awilix'
import { MoodleServiceImpl } from './services/moodle.service.js'
import type { MoodleDiConfig } from './types/index.js'

export const resolveMoodleModule = (): MoodleDiConfig => ({
	moodleService: asClass(MoodleServiceImpl).singleton(),
})
