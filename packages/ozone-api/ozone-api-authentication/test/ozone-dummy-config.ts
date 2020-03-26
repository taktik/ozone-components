import { ConfigType } from 'ozone-config'
export class OzoneConfig {
	static config: any = {
		host: '/ozone',
		endPoints: {
			login: '/rest/v3/authentication/login/user',
			logout: '/rest/v3/authentication/logout'
		}
	}
	static async get(): Promise<ConfigType> {
		return this.config
	}
}
