import { env } from '$env/dynamic/public';
import { date } from 'drizzle-orm/mysql-core';

export async function createAppointment({
	time,
	serviceId,
	token
}: {
	serviceId: string;
	time: string;
	token: string;
}) {
	const response = await fetch(`${env.PUBLIC_API_URL}/appointments`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			date: time,
			serviceId: +serviceId
		})
	});

	const data = await response.json();

	return data;
}

export async function getAppointmentsByUserId(userId: string) {
	const response = await fetch(`${env.PUBLIC_API_URL}/appointments/user/${userId}`);
	const data = await response.json();

	return data;
}

export async function editAppointment(
	appointment: {
		date?: string;
		service?: string;
	},
	token: string,
	appointmentId: number
) {
	const response = await fetch(`${env.PUBLIC_API_URL}/appointments/${appointmentId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(appointment)
	});

	const data = await response.json();

	return data;
}

export async function deleteAppointment(appointmentId: number, token: string) {
	const response = await fetch(`${env.PUBLIC_API_URL}/appointments/${appointmentId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	const data = await response.json();

	return data;
}
