import type {
	CommonDependencies,
	ExternalDependencies,
} from '@/core/types/deps.js'
import type { UsersModuleDependencies } from '@/modules/users/types/index.js'
import type { MoodleModuleDependencies } from '@/modules/moodle/types/index.js'
import type { AwilixContainer, NameAndRegistrationPair } from 'awilix'
import { resolveCommonDiConfig } from './common-di-config.js'
import { resolveUsersModule } from '@/modules/users/index.js'
import { resolveMoodleModule } from '@/modules/moodle/index.js'

type Dependencies = CommonDependencies &
	UsersModuleDependencies &
	MoodleModuleDependencies

type DiConfig = NameAndRegistrationPair<Dependencies>

export const registerDependencies = (
	diContainer: AwilixContainer,
	dependencies: ExternalDependencies,
) => {
	const diConfig: DiConfig = {
		...resolveCommonDiConfig(dependencies),
		...resolveUsersModule(),
		...resolveMoodleModule(),
	}

	diContainer.register(diConfig)
}

declare module '@fastify/awilix' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface Cradle extends Dependencies {}

	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface RequestCradle extends Dependencies {}
}
