import { getBlog } from '$lib/api/blogs';
export const load = async ({ params }) => {
	const { slug } = params;

	const id = slug.split('-')[0];

	const blog = await getBlog(id);

	return {
		blog
	};
};
