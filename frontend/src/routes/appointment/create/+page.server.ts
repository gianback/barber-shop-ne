import { createAppointment } from '$lib/api/appointment';
import type { Actions } from './$types';

export const actions = {
	create: async ({ request, cookies }) => {
		const formData = await request.formData();

		const serviceId = `${formData.get('service')}`;
		const time = `${formData.get('time')}`;
		const token = cookies.get('token') || '';
		const { success, appointment, message } = await createAppointment({ serviceId, time, token });

		console.log(success, appointment);

		return {
			success,
			appointment,
			message
		};
	}
} satisfies Actions;
