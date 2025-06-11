import { getBlog } from '$lib/api/blogs';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	const id = slug.split('-')[0];

	const blog = await getBlog(id);

	return {
		blog
	};
};
