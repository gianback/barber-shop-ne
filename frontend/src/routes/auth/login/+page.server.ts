import { login } from '$lib/api/auth';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();

		const email = `${data.get('email')}` || '';
		const password = `${data.get('password')}` || '';

		const { token, success, message } = await login({ email, password });

		cookies.set('token', token, {
			path: '/',
			maxAge: 60 * 60,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict'
		});

		if (success) {
			redirect(301, '/');
		}

		return {
			success,
			message
		};
	}
} satisfies Actions;
