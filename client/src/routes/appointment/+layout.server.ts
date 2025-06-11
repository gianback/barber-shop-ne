import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	if (!locals.user) {
		redirect(301, '/auth/login');
	}

	const token = cookies.get('token')!;

	return {
		token
	};
};
