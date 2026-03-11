import type { FastifyReply, FastifyRequest } from 'fastify'
import { MoodleTokenMissingError } from '../errors/index.js'
import type {
	MoodleLoginBody,
	CourseIdParams,
	UserIdParams,
	AssignmentIdParams,
	CourseGradesQuery,
	MoodleFilesQuery,
	MoodleSaveSubmissionBody,
	MoodleSubmitForGradingBody,
} from '../schemas/index.js'

const extractToken = (request: FastifyRequest): string | null => {
	const token = (request.headers as Record<string, string>)['x-moodle-token']
	return token || null
}

export const login = async (
	request: FastifyRequest<{ Body: MoodleLoginBody }>,
	reply: FastifyReply,
) => {
	const { moodleService } = request.diScope.cradle
	const result = await moodleService.login(request.body)

	return result.match(
		(data) => reply.status(200).send(data),
		(error) => reply.status(error.code).send(error.toObject()),
	)
}

export const getSiteInfo = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const token = extractToken(request)
	if (!token) {
		const error = new MoodleTokenMissingError()
		return reply.status(error.code).send(error.toObject())
	}

	const { moodleService } = request.diScope.cradle
	const result = await moodleService.getSiteInfo(token)

	return result.match(
		(data) => reply.status(200).send(data),
		(error) => reply.status(error.code).send(error.toObject()),
	)
}

export const getUserCourses = async (
	request: FastifyRequest<{ Params: UserIdParams }>,
	reply: FastifyReply,
) => {
	const token = extractToken(request)
	if (!token) {
		const error = new MoodleTokenMissingError()
		return reply.status(error.code).send(error.toObject())
	}

	const { moodleService } = request.diScope.cradle
	const result = await moodleService.getUserCourses(
		token,
		request.params.userId,
	)

	return result.match(
		(data) => reply.status(200).send(data),
		(error) => reply.status(error.code).send(error.toObject()),
	)
}

export const getAssignments = async (
	request: FastifyRequest<{ Params: CourseIdParams }>,
	reply: FastifyReply,
) => {
	const token = extractToken(request)
	if (!token) {
		const error = new MoodleTokenMissingError()
		return reply.status(error.code).send(error.toObject())
	}

	const { moodleService } = request.diScope.cradle
	const result = await moodleService.getAssignments(
		token,
		request.params.courseId,
	)

	return result.match(
		(data) => reply.status(200).send(data),
		(error) => reply.status(error.code).send(error.toObject()),
	)
}

export const getCalendarEvents = async (
	request: FastifyRequest<{ Params: CourseIdParams }>,
	reply: FastifyReply,
) => {
	const token = extractToken(request)
	if (!token) {
		const error = new MoodleTokenMissingError()
		return reply.status(error.code).send(error.toObject())
	}

	const { moodleService } = request.diScope.cradle
	const result = await moodleService.getCalendarEvents(
		token,
		request.params.courseId,
	)

	return result.match(
		(data) => reply.status(200).send(data),
		(error) => reply.status(error.code).send(error.toObject()),
	)
}

export const getGrades = async (
	request: FastifyRequest<{
		Params: CourseIdParams
		Querystring: CourseGradesQuery
	}>,
	reply: FastifyReply,
) => {
	const token = extractToken(request)
	if (!token) {
		const error = new MoodleTokenMissingError()
		return reply.status(error.code).send(error.toObject())
	}

	const { moodleService } = request.diScope.cradle
	const result = await moodleService.getGrades(
		token,
		request.params.courseId,
		request.query.userId,
	)

	return result.match(
		(data) => reply.status(200).send(data),
		(error) => reply.status(error.code).send(error.toObject()),
	)
}

export const getCourseContents = async (
	request: FastifyRequest<{ Params: CourseIdParams }>,
	reply: FastifyReply,
) => {
	const token = extractToken(request)
	if (!token) {
		const error = new MoodleTokenMissingError()
		return reply.status(error.code).send(error.toObject())
	}

	const { moodleService } = request.diScope.cradle
	const result = await moodleService.getCourseContents(
		token,
		request.params.courseId,
	)

	return result.match(
		(data) => reply.status(200).send(data),
		(error) => reply.status(error.code).send(error.toObject()),
	)
}

export const getEnrolledUsers = async (
	request: FastifyRequest<{ Params: CourseIdParams }>,
	reply: FastifyReply,
) => {
	const token = extractToken(request)
	if (!token) {
		const error = new MoodleTokenMissingError()
		return reply.status(error.code).send(error.toObject())
	}

	const { moodleService } = request.diScope.cradle
	const result = await moodleService.getEnrolledUsers(
		token,
		request.params.courseId,
	)

	return result.match(
		(data) => reply.status(200).send(data),
		(error) => reply.status(error.code).send(error.toObject()),
	)
}

export const getUserDetails = async (
	request: FastifyRequest<{ Params: UserIdParams }>,
	reply: FastifyReply,
) => {
	const token = extractToken(request)
	if (!token) {
		const error = new MoodleTokenMissingError()
		return reply.status(error.code).send(error.toObject())
	}

	const { moodleService } = request.diScope.cradle
	const result = await moodleService.getUserDetails(
		token,
		request.params.userId,
	)

	return result.match(
		(data) => reply.status(200).send(data),
		(error) => reply.status(error.code).send(error.toObject()),
	)
}

export const getCourseContext = async (
	request: FastifyRequest<{ Params: CourseIdParams }>,
	reply: FastifyReply,
) => {
	const token = extractToken(request)
	if (!token) {
		const error = new MoodleTokenMissingError()
		return reply.status(error.code).send(error.toObject())
	}

	const { moodleService } = request.diScope.cradle
	const result = await moodleService.getCourseContext(
		token,
		request.params.courseId,
	)

	return result.match(
		(data) => reply.status(200).send(data),
		(error) => reply.status(error.code).send(error.toObject()),
	)
}

export const getFiles = async (
	request: FastifyRequest<{ Querystring: MoodleFilesQuery }>,
	reply: FastifyReply,
) => {
	const token = extractToken(request)
	if (!token) {
		const error = new MoodleTokenMissingError()
		return reply.status(error.code).send(error.toObject())
	}

	const { moodleService } = request.diScope.cradle
	const result = await moodleService.getFiles(token, request.query)

	return result.match(
		(data) => reply.status(200).send(data),
		(error) => reply.status(error.code).send(error.toObject()),
	)
}

export const saveSubmission = async (
	request: FastifyRequest<{
		Params: AssignmentIdParams
		Body: MoodleSaveSubmissionBody
	}>,
	reply: FastifyReply,
) => {
	const token = extractToken(request)
	if (!token) {
		const error = new MoodleTokenMissingError()
		return reply.status(error.code).send(error.toObject())
	}

	const { moodleService } = request.diScope.cradle
	const result = await moodleService.saveSubmission(
		token,
		request.params.assignmentId,
		request.body.plugindata,
	)

	return result.match(
		(data) => reply.status(200).send(data),
		(error) => reply.status(error.code).send(error.toObject()),
	)
}

export const submitForGrading = async (
	request: FastifyRequest<{
		Params: AssignmentIdParams
		Body: MoodleSubmitForGradingBody
	}>,
	reply: FastifyReply,
) => {
	const token = extractToken(request)
	if (!token) {
		const error = new MoodleTokenMissingError()
		return reply.status(error.code).send(error.toObject())
	}

	const { moodleService } = request.diScope.cradle
	const result = await moodleService.submitForGrading(
		token,
		request.params.assignmentId,
		request.body.userId,
	)

	return result.match(
		(data) => reply.status(200).send(data),
		(error) => reply.status(error.code).send(error.toObject()),
	)
}
