import { getBlogs } from '$lib/api/blogs';
import { getServices } from '$lib/api/services';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	const [services, blogs] = await Promise.all([getServices(), getBlogs()]);

	return {
		services,
		blogs,
		user
	};
};
