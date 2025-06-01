import { getBlogs } from '$lib/api/blogs';
import { getServices } from '$lib/api/services';

export const load = async () => {
	const [services, blogs] = await Promise.all([getServices(), getBlogs()]);

	return {
		services,
		blogs
	};
};
