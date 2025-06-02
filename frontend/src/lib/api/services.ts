import { env } from '$env/dynamic/public';
import { toast } from 'svelte-sonner';

export async function getServices() {
	try {
		const response = await fetch(`${env.PUBLIC_API_URL}/services`);
		return await response.json();
	} catch (error) {
		console.log(error);
		return [];
	}
}

export async function createService({ service, token }: { service: FormData; token: string }) {
	try {
		const response = await fetch(`${env.PUBLIC_API_URL}/services`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: service
		});

		if (response.status === 401) {
			toast.error('Sesión caducada');
			return false;
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
	}
}

export async function updateService({
	id,
	service,
	token
}: {
	id: number;
	service: {
		name?: string;
		description?: string;
		price?: number;
	};
	token: string;
}) {
	try {
		const response = await fetch(`${env.PUBLIC_API_URL}/services/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(service)
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

export function deleteService({ id, token }: { id: number; token: string }) {
	return fetch(`${env.PUBLIC_API_URL}/services/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
}
