import { env } from '$env/dynamic/public';

export async function getUser(token: string) {
	return await fetch(`${env.PUBLIC_API_URL}/users/me`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
}
