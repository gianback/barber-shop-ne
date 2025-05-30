import { env } from '$env/dynamic/private';

export async function getBlogs() {
	try {
		const respoinse = await fetch(`${env.API_URL}/blogs`);

		return await respoinse.json();
	} catch (error) {
		console.log(error);
		return [];
	}
}
