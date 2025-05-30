import { env } from '$env/dynamic/private';

export async function getServices() {
	try {
		const response = await fetch(`${env.API_URL}/services`);
		return await response.json();
	} catch (error) {
		console.log(error);
		return [];
	}
}
