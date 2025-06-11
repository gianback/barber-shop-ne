import { env } from '$env/dynamic/public';

export async function createCheckoutSession({
	serviceId,
	appointmentId,
	token
}: {
	serviceId: number;
	appointmentId: number;
	token: string;
}) {
	console.log(typeof serviceId, typeof appointmentId);

	const response = await fetch(`${env.PUBLIC_API_URL}/payments/create-checkout-session`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			serviceId,
			appointmentId
		})
	});

	const data = await response.json();

	return data;
}
