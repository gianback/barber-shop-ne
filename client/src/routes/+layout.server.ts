import { getBlogs } from '$lib/api/blogs';
import { getServices } from '$lib/api/services';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;
	const [services, blogs] = await Promise.all([getServices(), getBlogs()]);

	return {
		services,
		blogs,
		user
	};
};
