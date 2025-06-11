import { register } from '$lib/api/auth';
import { type Actions } from '@sveltejs/kit';

export const actions = {
	register: async ({ request, cookies }) => {
		const data = await request.formData();

		const email = `${data.get('email')}` || '';
		const password = `${data.get('password')}` || '';
		const name = `${data.get('name')}` || '';
		const last_name = `${data.get('last_name')}` || '';
		const phone = `${data.get('phone')}` || '';

		const { token, success, message } = await register({ email, password, name, last_name, phone });

		cookies.set('token', token, {
			path: '/',
			maxAge: 60 * 60,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict'
		});

		return {
			success,
			message
		};
	}
} satisfies Actions;
