import { err, ok, type Result } from 'neverthrow'
import type { HttpError } from '@/core/utils/errors.js'
import { InternalServerError } from '@/core/utils/errors.js'
import { MoodleApiError, MoodleAuthError } from '../errors/index.js'
import type { MoodleLoginBody } from '../schemas/index.js'
import type {
	MoodleInjectableDependencies,
	MoodleService,
} from '../types/index.js'

export class MoodleServiceImpl implements MoodleService {
	private readonly baseUrl: string

	constructor({ config }: MoodleInjectableDependencies) {
		this.baseUrl = config.moodle.baseUrl
	}

	private buildApiUrl(
		token: string,
		wsfunction: string,
		params: Record<string, string | number> = {},
	): string {
		const url = new URL('/webservice/rest/server.php', this.baseUrl)
		url.searchParams.set('wstoken', token)
		url.searchParams.set('wsfunction', wsfunction)
		url.searchParams.set('moodlewsrestformat', 'json')

		for (const [key, value] of Object.entries(params)) {
			url.searchParams.set(key, String(value))
		}

		return url.toString()
	}

	private async fetchMoodle(
		url: string,
		options?: RequestInit,
	): Promise<Result<unknown, HttpError>> {
		try {
			const response = await fetch(url, options)
			const contentType = response.headers.get('content-type') || ''

			if (
				!contentType.includes('application/json') &&
				!contentType.includes('text/json')
			) {
				const text = await response.text()
				if (text.startsWith('{') || text.startsWith('[')) {
					const data = JSON.parse(text)
					if (data && typeof data === 'object' && 'exception' in data) {
						return err(
							new MoodleApiError(
								data.message || data.exception || 'Moodle API error',
							),
						)
					}
					return ok(data)
				}
				return err(new MoodleApiError('Moodle returned non-JSON response'))
			}

			const data = await response.json()

			if (data && typeof data === 'object' && 'exception' in data) {
				return err(
					new MoodleApiError(
						data.message || data.exception || 'Moodle API error',
					),
				)
			}

			if (
				data &&
				typeof data === 'object' &&
				'error' in data &&
				!('token' in data)
			) {
				return err(
					new MoodleApiError(data.error || data.message || 'Moodle error'),
				)
			}

			return ok(data)
		} catch (e: unknown) {
			if (e instanceof MoodleApiError || e instanceof MoodleAuthError) {
				return err(e)
			}
			return err(new InternalServerError())
		}
	}

	async login(
		data: MoodleLoginBody,
	): Promise<Result<{ token: string; privatetoken?: string }, HttpError>> {
		try {
			const url = new URL('/login/token.php', this.baseUrl)

			const body = new URLSearchParams({
				username: data.username,
				password: data.password,
				service: 'moodle_mobile_app',
			})

			const response = await fetch(url.toString(), {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: body.toString(),
			})

			const result = (await response.json()) as Record<string, unknown>

			if (result.error) {
				return err(new MoodleAuthError(String(result.error)))
			}

			if (!result.token || typeof result.token !== 'string') {
				return err(new MoodleAuthError('Moodle did not return a valid token'))
			}

			return ok({
				token: result.token,
				privatetoken:
					typeof result.privatetoken === 'string'
						? result.privatetoken
						: undefined,
			})
		} catch {
			return err(new MoodleApiError('Failed to connect to Moodle'))
		}
	}

	async getSiteInfo(token: string): Promise<Result<unknown, HttpError>> {
		const url = this.buildApiUrl(token, 'core_webservice_get_site_info')
		return this.fetchMoodle(url)
	}

	async getUserCourses(
		token: string,
		userId: number,
	): Promise<Result<unknown, HttpError>> {
		const url = this.buildApiUrl(token, 'core_enrol_get_users_courses', {
			userid: userId,
		})
		return this.fetchMoodle(url)
	}

	async getAssignments(
		token: string,
		courseId: number,
	): Promise<Result<unknown, HttpError>> {
		const url =
			this.buildApiUrl(token, 'mod_assign_get_assignments') +
			'&courseids[]=' +
			courseId
		return this.fetchMoodle(url)
	}

	async getCalendarEvents(
		token: string,
		courseId: number,
	): Promise<Result<unknown, HttpError>> {
		const url =
			this.buildApiUrl(token, 'core_calendar_get_calendar_events') +
			'&events[courseids][]=' +
			courseId
		return this.fetchMoodle(url)
	}

	async getGrades(
		token: string,
		courseId: number,
		userId: number,
	): Promise<Result<unknown, HttpError>> {
		const url = this.buildApiUrl(token, 'gradereport_user_get_grade_items', {
			courseid: courseId,
			userid: userId,
		})
		return this.fetchMoodle(url)
	}

	async getCourseContents(
		token: string,
		courseId: number,
	): Promise<Result<unknown, HttpError>> {
		const url = this.buildApiUrl(token, 'core_course_get_contents', {
			courseid: courseId,
		})
		return this.fetchMoodle(url)
	}

	async getEnrolledUsers(
		token: string,
		courseId: number,
	): Promise<Result<unknown, HttpError>> {
		const url = this.buildApiUrl(token, 'core_enrol_get_enrolled_users', {
			courseid: courseId,
		})
		return this.fetchMoodle(url)
	}

	async getUserDetails(
		token: string,
		userId: number,
	): Promise<Result<unknown, HttpError>> {
		const url =
			this.buildApiUrl(token, 'core_user_get_users_by_field', { field: 'id' }) +
			'&values[0]=' +
			userId
		return this.fetchMoodle(url)
	}

	async getCourseContext(
		token: string,
		courseId: number,
	): Promise<Result<unknown, HttpError>> {
		const url =
			this.buildApiUrl(token, 'core_course_get_courses') +
			'&options[ids][]=' +
			courseId
		return this.fetchMoodle(url)
	}

	async getFiles(
		token: string,
		params: {
			contextid: number
			component: string
			filearea: string
			itemid: number
			filepath: string
			modified: number
		},
	): Promise<Result<unknown, HttpError>> {
		const url = this.buildApiUrl(token, 'core_files_get_files', {
			contextid: params.contextid,
			component: params.component,
			filearea: params.filearea,
			itemid: params.itemid,
			filepath: params.filepath,
			modified: params.modified,
		})
		return this.fetchMoodle(url)
	}

	async saveSubmission(
		token: string,
		assignmentId: number,
		plugindata: unknown,
	): Promise<Result<unknown, HttpError>> {
		const url = this.buildApiUrl(token, 'mod_assign_save_submission')

		const bodyParams = new URLSearchParams()
		bodyParams.set('assignmentid', String(assignmentId))

		if (plugindata && typeof plugindata === 'object') {
			const flattenPluginData = (
				obj: Record<string, unknown>,
				prefix: string,
			) => {
				for (const [key, value] of Object.entries(obj)) {
					const fullKey = prefix ? prefix + '[' + key + ']' : key
					if (value && typeof value === 'object' && !Array.isArray(value)) {
						flattenPluginData(value as Record<string, unknown>, fullKey)
					} else {
						bodyParams.set(fullKey, String(value))
					}
				}
			}
			flattenPluginData(plugindata as Record<string, unknown>, 'plugindata')
		}

		return this.fetchMoodle(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: bodyParams.toString(),
		})
	}

	async submitForGrading(
		token: string,
		assignmentId: number,
		userId?: number,
	): Promise<Result<unknown, HttpError>> {
		const url = this.buildApiUrl(token, 'mod_assign_submit_for_grading')

		const bodyParams = new URLSearchParams()
		bodyParams.set('assignmentid', String(assignmentId))
		if (userId !== undefined) {
			bodyParams.set('userid', String(userId))
		}

		return this.fetchMoodle(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: bodyParams.toString(),
		})
	}
}
