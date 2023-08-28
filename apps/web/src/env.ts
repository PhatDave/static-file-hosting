// export const ORIGIN = 'https://file-hosting.site.quack-lab.dev';
export const ORIGIN = 'http://localhost:3000'
export const API_URL = `${ORIGIN}/api`;
export const FILE_URL = `${ORIGIN}/file`;

export const DEFAULT_HEADERS = {
	'Accept': 'application/json',
	'Content-Type': 'application/json',
	'Accept-Encoding': 'gzip, deflate, br',
};
export const DEFAULT_GET_OPTIONS = {
	method: 'GET',
	headers: DEFAULT_HEADERS,
};
export const DEFAULT_POST_OPTIONS = {
	method: 'POST',
	headers: DEFAULT_HEADERS,
};
export const DEFAULT_DELETE_HEADERS = {
	method: 'DELETE',
};
export const DEFAULT_PATCH_OPTIONS = {
	method: 'PATCH',
};