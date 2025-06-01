import { env } from '$env/dynamic/public';

export async function getBlogs() {
	try {
		const respoinse = await fetch(`${env.PUBLIC_API_URL}/blogs`);

		return await respoinse.json();
	} catch (error) {
		console.log(error);
		return [];
	}
}
