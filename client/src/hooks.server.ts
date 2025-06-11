import { getUser } from '$lib/api/user';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {
		return new Response(null, { status: 204 }); // Return empty response with 204 No Content
	}

	const jwt = event.cookies.get('token');

	if (jwt) {
		const response = await getUser(jwt);

		if (response.ok) {
			const user = await response.json();
			event.locals.user = user;
		} else {
			event.locals.user = null;
			event.cookies.delete('token', {
				path: '/'
			});
		}
	}

	if (event.url.pathname.startsWith('/admin')) {
		if (jwt) {
			const response = await getUser(jwt);

			if (response.ok) {
				const user = await response.json();
				event.locals.user = user;
			} else {
				event.cookies.delete('token', {
					path: '/'
				});
			}
		} else {
			event.locals.user = null;
			event.cookies.delete('token', {
				path: '/'
			});
			redirect(301, '/auth/login');
		}
	}

	return resolve(event);
};
