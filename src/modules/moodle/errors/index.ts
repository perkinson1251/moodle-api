import { HttpError } from '@/core/utils/errors.js'

class MoodleAuthError extends HttpError {
	constructor(message: string = 'Invalid Moodle credentials') {
		super(401, message)
		this.name = 'MOODLE_AUTH_ERROR'
	}
}

class MoodleTokenMissingError extends HttpError {
	constructor() {
		super(401, 'Moodle token is required. Provide it via x-moodle-token header')
		this.name = 'MOODLE_TOKEN_MISSING'
	}
}

class MoodleApiError extends HttpError {
	constructor(message: string, code: number = 502) {
		super(code, message)
		this.name = 'MOODLE_API_ERROR'
	}
}

export { MoodleApiError, MoodleAuthError, MoodleTokenMissingError }
