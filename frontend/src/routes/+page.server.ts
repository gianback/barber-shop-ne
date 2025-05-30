import { getBlogs } from '$lib/services/get-blogs';
import { getServices } from '$lib/services/get-services';

export const load = async () => {
	const [services, blogs] = await Promise.all([getServices(), getBlogs()]);

	return {
		services,
		blogs
	};
};
