import { env } from '$env/dynamic/public';

interface Login {
	email: string;
	password: string;
}

interface Register extends Login {
	name: string;
	last_name: string;
	phone: string;
}

const login = async ({ email, password }: Login) => {
	try {
		const response = await fetch(`${env.PUBLIC_API_URL}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});

		const data = await response.json();

		return {
			success: response.ok,
			message: data.message,
			token: data?.token
		};
	} catch (error) {
		console.log('Login Error:', error);
		return {
			success: false,
			message: 'Ha ocurrido un error, intenta de nuevo',
			token: null
		};
	}
};

const register = async ({ email, last_name, name, password, phone }: Register) => {
	try {
		const response = await fetch(`${env.PUBLIC_API_URL}/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password, name, last_name, phone })
		});

		const data = await response.json();

		return {
			success: response.ok,
			message: data.message,
			token: data?.token
		};
	} catch (error) {
		console.log('Register Error:', error);
		throw new Error('Error creando usuario');
	}
};

export { login, register };
