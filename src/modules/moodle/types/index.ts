import type { BaseDiConfig, InjectableDependencies } from '@/core/types/deps.js'
import type { Result } from 'neverthrow'
import type { HttpError } from '@/core/utils/errors.js'
import type { MoodleLoginBody } from '../schemas/index.js'

interface MoodleService {
	login: (
		data: MoodleLoginBody,
	) => Promise<Result<{ token: string; privatetoken?: string }, HttpError>>
	getSiteInfo: (token: string) => Promise<Result<unknown, HttpError>>
	getUserCourses: (
		token: string,
		userId: number,
	) => Promise<Result<unknown, HttpError>>
	getAssignments: (
		token: string,
		courseId: number,
	) => Promise<Result<unknown, HttpError>>
	getCalendarEvents: (
		token: string,
		courseId: number,
	) => Promise<Result<unknown, HttpError>>
	getGrades: (
		token: string,
		courseId: number,
		userId: number,
	) => Promise<Result<unknown, HttpError>>
	getCourseContents: (
		token: string,
		courseId: number,
	) => Promise<Result<unknown, HttpError>>
	getEnrolledUsers: (
		token: string,
		courseId: number,
	) => Promise<Result<unknown, HttpError>>
	getUserDetails: (
		token: string,
		userId: number,
	) => Promise<Result<unknown, HttpError>>
	getCourseContext: (
		token: string,
		courseId: number,
	) => Promise<Result<unknown, HttpError>>
	getFiles: (
		token: string,
		params: {
			contextid: number
			component: string
			filearea: string
			itemid: number
			filepath: string
			modified: number
		},
	) => Promise<Result<unknown, HttpError>>
	saveSubmission: (
		token: string,
		assignmentId: number,
		plugindata: unknown,
	) => Promise<Result<unknown, HttpError>>
	submitForGrading: (
		token: string,
		assignmentId: number,
		userId?: number,
	) => Promise<Result<unknown, HttpError>>
}

interface MoodleModuleDependencies {
	moodleService: MoodleService
}

type MoodleInjectableDependencies =
	InjectableDependencies<MoodleModuleDependencies>

type MoodleDiConfig = BaseDiConfig<MoodleModuleDependencies>

export type {
	MoodleDiConfig,
	MoodleInjectableDependencies,
	MoodleModuleDependencies,
	MoodleService,
}
