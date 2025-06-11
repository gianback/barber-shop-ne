import { env } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const { user } = locals;

	const token = cookies.get('token') || '';

	const res = await fetch(`${env.PUBLIC_API_URL}/appointments/user/${user.id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
	const data = await res.json();

	return {
		appointments: data
	};
};
