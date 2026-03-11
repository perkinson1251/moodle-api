interface DbConfig {
	user: string
	password: string
	host: string
	port: number
	database: string
}

interface RedisConfig {
	user: string
	host: string
	port: number
	password: string
}

interface MoodleConfig {
	baseUrl: string
}

interface Config {
	db: DbConfig
	redis: RedisConfig
	moodle: MoodleConfig
}

export type { Config, DbConfig, MoodleConfig, RedisConfig }
