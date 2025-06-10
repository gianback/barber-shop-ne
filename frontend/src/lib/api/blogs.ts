import { env } from '$env/dynamic/public';
import { toast } from 'svelte-sonner';

export async function getBlogs() {
	try {
		const response = await fetch(`${env.PUBLIC_API_URL}/blogs`);
		return await response.json();
	} catch (error) {
		console.log(error);
		return [];
	}
}

export async function getBlog(id: string) {
	try {
		const response = await fetch(`${env.PUBLIC_API_URL}/blogs/${id}`);
		const blog = await response.json();

		return blog;
	} catch (error) {
		console.log(error);
	}
}

export async function createBlog({ blog, token }: { blog: FormData; token: string }) {
	try {
		const response = await fetch(`${env.PUBLIC_API_URL}/blogs`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: blog
		});

		if (response.status === 401) {
			toast.error('Sesión caducada');
			return { success: false };
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
	}
}

export async function updateBlog({
	id,
	blog,
	token
}: {
	id: number;
	blog: {
		name?: string;
		description?: string;
		price?: number;
	};
	token: string;
}) {
	try {
		const response = await fetch(`${env.PUBLIC_API_URL}/blogs/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(blog)
		});

		if (response.status === 401) {
			toast.error('Sesión caducada');
			return false;
		}

		const data = await response.json();
		return data.success;
	} catch (error) {
		console.log(error);
	}
}

export async function updateBlogImage({
	image,
	blogId,
	token
}: {
	blogId: number;
	token: string;
	image: FormData;
}) {
	try {
		const response = await fetch(`${env.PUBLIC_API_URL}/blogs/image/${blogId}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: image
		});

		const data = await response.json();

		return data;
	} catch (error) {
		console.log(error);
	}
}

export function deleteBlog({ id, token }: { id: number; token: string }) {
	return fetch(`${env.PUBLIC_API_URL}/blogs/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
}
