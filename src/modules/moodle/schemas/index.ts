import { z } from 'zod'

// === Auth ===
const MoodleLoginBodySchema = z.object({
	username: z.string().min(1).describe('Moodle username (e.g. user@nure.ua)'),
	password: z.string().min(1).describe('Moodle password'),
})

const MoodleTokenResponseSchema = z
	.object({
		token: z.string().describe('Moodle WebService token'),
		privatetoken: z.string().optional().describe('Private token (optional)'),
	})
	.describe('Moodle auth token response')

const MoodleErrorResponseSchema = z
	.object({
		error: z.string().describe('Error message'),
		errorcode: z.string().optional().describe('Error code'),
		exception: z.string().optional().describe('Exception type'),
		message: z.string().optional().describe('Detailed message'),
	})
	.describe('Moodle error response')

// === Site Info ===
const MoodleSiteInfoSchema = z
	.object({
		userid: z.number().describe('Moodle user ID'),
		fullname: z.string().describe('Full name'),
		username: z.string().describe('Username'),
		siteurl: z.string().describe('Site URL'),
		functions: z.array(z.any()).optional().describe('Available web services'),
	})
	.passthrough()
	.describe('Moodle site info')

// === Courses ===
const MoodleCourseSchema = z
	.object({
		id: z.number().describe('Course ID'),
		shortname: z.string().describe('Course short name'),
		fullname: z.string().describe('Course full name'),
		idnumber: z.string().optional().describe('Course ID number'),
		visible: z.number().optional().describe('Course visibility'),
	})
	.passthrough()

const MoodleCoursesResponseSchema = z
	.array(MoodleCourseSchema)
	.describe('List of user courses')

// === Assignments ===
const MoodleAssignmentSchema = z
	.object({
		id: z.number().describe('Assignment ID'),
		name: z.string().describe('Assignment name'),
		duedate: z.number().describe('Due date (unix timestamp)'),
		intro: z.string().optional().describe('Assignment description (HTML)'),
	})
	.passthrough()

const MoodleAssignmentsResponseSchema = z
	.object({
		courses: z.array(
			z
				.object({
					id: z.number(),
					fullname: z.string(),
					assignments: z.array(MoodleAssignmentSchema),
				})
				.passthrough(),
		),
	})
	.passthrough()
	.describe('Assignments response')

// === Calendar Events ===
const MoodleEventSchema = z
	.object({
		id: z.number().describe('Event ID'),
		name: z.string().describe('Event name'),
		description: z.string().optional().describe('Event description (HTML)'),
		timestart: z.number().describe('Event start time (unix timestamp)'),
		timeduration: z.number().optional().describe('Event duration in seconds'),
		courseid: z.number().optional().describe('Course ID'),
		eventtype: z.string().optional().describe('Event type'),
		modulename: z.string().nullable().optional().describe('Module name'),
		instance: z.number().nullable().optional().describe('Module instance ID'),
	})
	.passthrough()

const MoodleEventsResponseSchema = z
	.object({
		events: z.array(MoodleEventSchema),
	})
	.passthrough()
	.describe('Calendar events response')

// === Grades ===
const MoodleGradeItemSchema = z
	.object({
		id: z.number().describe('Grade item ID'),
		itemname: z.string().nullable().optional().describe('Item name'),
		itemtype: z.string().optional().describe('Item type'),
		itemmodule: z.string().nullable().optional().describe('Item module'),
		iteminstance: z.number().optional().describe('Item instance'),
		gradeformatted: z.string().optional().describe('Formatted grade'),
		grademax: z.number().optional().describe('Maximum grade'),
		grademin: z.number().optional().describe('Minimum grade'),
	})
	.passthrough()

const MoodleGradesResponseSchema = z
	.object({
		usergrades: z.array(
			z
				.object({
					courseid: z.number().optional(),
					userid: z.number().optional(),
					userfullname: z.string().optional(),
					gradeitems: z.array(MoodleGradeItemSchema),
				})
				.passthrough(),
		),
	})
	.passthrough()
	.describe('Grades response')

// === Course Contents ===
const MoodleModuleContentSchema = z
	.object({
		type: z.string().optional().describe('Content type'),
		fileurl: z.string().optional().describe('File URL'),
	})
	.passthrough()

const MoodleCourseModuleSchema = z
	.object({
		id: z.number().describe('Module ID'),
		modname: z.string().optional().describe('Module name'),
		name: z.string().describe('Module display name'),
		url: z.string().optional().nullable().describe('Module URL'),
		contents: z.array(MoodleModuleContentSchema).optional().nullable(),
	})
	.passthrough()

const MoodleCourseSectionSchema = z
	.object({
		id: z.number().describe('Section ID'),
		name: z.string().describe('Section name'),
		modules: z.array(MoodleCourseModuleSchema),
	})
	.passthrough()

const MoodleCourseContentsResponseSchema = z
	.array(MoodleCourseSectionSchema)
	.describe('Course contents')

// === Enrolled Users ===
const MoodleEnrolledUserSchema = z
	.object({
		id: z.number().describe('User ID'),
		fullname: z.string().describe('Full name'),
		email: z.string().optional().describe('Email'),
		roles: z
			.array(z.object({ shortname: z.string() }).passthrough())
			.optional()
			.describe('User roles'),
	})
	.passthrough()

const MoodleEnrolledUsersResponseSchema = z
	.array(MoodleEnrolledUserSchema)
	.describe('Enrolled users response')

// === User Details ===
const MoodleUserDetailSchema = z
	.object({
		id: z.number().describe('User ID'),
		fullname: z.string().describe('Full name'),
		email: z.string().optional().describe('Email'),
		department: z.string().optional().describe('Department/group'),
		institution: z.string().optional().describe('Institution/faculty'),
		idnumber: z.string().optional().describe('Student ID number'),
		profileimageurl: z.string().optional().describe('Profile image URL'),
	})
	.passthrough()

const MoodleUserDetailsResponseSchema = z
	.array(MoodleUserDetailSchema)
	.describe('User details response')

// === Course Context (for files) ===
const MoodleCourseInfoSchema = z
	.object({
		id: z.number().describe('Course ID'),
		shortname: z.string().optional(),
		fullname: z.string().optional(),
	})
	.passthrough()

const MoodleCourseInfoResponseSchema = z
	.array(MoodleCourseInfoSchema)
	.describe('Course info with context')

// === Files ===
const MoodleFileSchema = z
	.object({
		filename: z.string().optional().describe('File name'),
		filepath: z.string().optional().describe('File path'),
		filesize: z.number().optional().describe('File size'),
		fileurl: z.string().optional().describe('File URL'),
		timemodified: z.number().optional().describe('Last modified timestamp'),
		mimetype: z.string().nullable().optional().describe('MIME type'),
		type: z.string().optional().describe('File or folder'),
	})
	.passthrough()

const MoodleFilesResponseSchema = z
	.object({
		files: z.array(MoodleFileSchema),
	})
	.passthrough()
	.describe('Course files response')

// === Files query params ===
const MoodleFilesQuerySchema = z.object({
	contextid: z.coerce.number().describe('Context ID'),
	component: z.string().default('course').describe('Component'),
	filearea: z.string().default('section').describe('File area'),
	itemid: z.coerce.number().default(0).describe('Item ID'),
	filepath: z.string().default('/').describe('File path'),
	modified: z.coerce.number().default(0).describe('Modified since timestamp'),
})

// === Submission ===
const MoodleSaveSubmissionBodySchema = z.object({
	plugindata: z.any().describe('Plugin data for the submission'),
})

const MoodleSubmitForGradingBodySchema = z.object({
	userId: z.number().optional().describe('User ID'),
})

const MoodleSubmissionResponseSchema = z
	.any()
	.describe('Moodle submission response')

// === Params ===
const CourseIdParamsSchema = z.object({
	courseId: z.coerce.number().describe('Course ID'),
})

const UserIdParamsSchema = z.object({
	userId: z.coerce.number().describe('User ID'),
})

const AssignmentIdParamsSchema = z.object({
	assignmentId: z.coerce.number().describe('Assignment ID'),
})

const CourseGradesQuerySchema = z.object({
	userId: z.coerce.number().describe('Moodle user ID'),
})

// === Headers ===
const MoodleTokenHeaderSchema = z.object({
	'x-moodle-token': z.string().min(1).describe('Moodle WebService token'),
})

// Type exports
type MoodleLoginBody = z.infer<typeof MoodleLoginBodySchema>
type CourseIdParams = z.infer<typeof CourseIdParamsSchema>
type UserIdParams = z.infer<typeof UserIdParamsSchema>
type AssignmentIdParams = z.infer<typeof AssignmentIdParamsSchema>
type CourseGradesQuery = z.infer<typeof CourseGradesQuerySchema>
type MoodleFilesQuery = z.infer<typeof MoodleFilesQuerySchema>
type MoodleSaveSubmissionBody = z.infer<typeof MoodleSaveSubmissionBodySchema>
type MoodleSubmitForGradingBody = z.infer<
	typeof MoodleSubmitForGradingBodySchema
>

export {
	AssignmentIdParamsSchema,
	CourseGradesQuerySchema,
	CourseIdParamsSchema,
	MoodleAssignmentsResponseSchema,
	MoodleCourseContentsResponseSchema,
	MoodleCourseInfoResponseSchema,
	MoodleCoursesResponseSchema,
	MoodleEnrolledUsersResponseSchema,
	MoodleErrorResponseSchema,
	MoodleEventsResponseSchema,
	MoodleFilesQuerySchema,
	MoodleFilesResponseSchema,
	MoodleGradesResponseSchema,
	MoodleLoginBodySchema,
	MoodleSaveSubmissionBodySchema,
	MoodleSiteInfoSchema,
	MoodleSubmissionResponseSchema,
	MoodleSubmitForGradingBodySchema,
	MoodleTokenHeaderSchema,
	MoodleTokenResponseSchema,
	MoodleUserDetailsResponseSchema,
	UserIdParamsSchema,
}

export type {
	AssignmentIdParams,
	CourseGradesQuery,
	CourseIdParams,
	MoodleFilesQuery,
	MoodleLoginBody,
	MoodleSaveSubmissionBody,
	MoodleSubmitForGradingBody,
	UserIdParams,
}
