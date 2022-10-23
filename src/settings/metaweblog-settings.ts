export interface MetaweblogSettings {
	appkey: string
	url: string;
	username: string,
	password: string,
	vaultAbsolutePath: string,
	blogId: string
}

export const DEFAULT_SETTINGS: MetaweblogSettings = {
	appkey: '',
	url: '',
	username: '',
	password: '',
	vaultAbsolutePath: '',
	blogId: ''
}

