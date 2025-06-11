<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { redirect } from '@sveltejs/kit';

	let showPassword = $state(false);

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	const { form } = $props();
</script>

<svelte:head>
	<title>Registro - Crear cuenta</title>
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8"
>
	<div class="w-full max-w-md">
		<!-- Header -->
		<div class="mb-8 text-center">
			<div
				class="mb-4 inline-flex items-center justify-center rounded-md p-2"
				style="background-color: #04050C;"
			>
				<img src="/images/logo.png" alt="Logo barberia" />
			</div>
			<h1 class="text-3xl font-bold text-gray-900">Crear cuenta</h1>
			<p class="mt-2 text-gray-600">Completa tus datos para registrarte</p>
		</div>

		<!-- Registration Form -->
		<div class="rounded-2xl bg-white p-8 shadow-xl">
			<form method="POST" action="?/register" class="space-y-5">
				<!-- Name Field -->
				<div>
					<label for="name" class="mb-2 block text-sm font-medium text-gray-700"> Nombre </label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
						</div>
						<input
							id="name"
							type="text"
							name="name"
							required
							class="block w-full rounded-lg border py-3 pl-10 pr-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
							style="focus:ring-color: #F0B35B;"
							placeholder="Tu nombre"
						/>
					</div>
				</div>

				<!-- Last Name Field -->
				<div>
					<label for="last_name" class="mb-2 block text-sm font-medium text-gray-700">
						Apellido
					</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<input
							id="last_name"
							type="text"
							name="last_name"
							required
							class="block w-full rounded-lg border py-3 pl-10 pr-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
							style="focus:ring-color: #F0B35B;"
							placeholder="Tu apellido"
						/>
					</div>
				</div>

				<!-- Phone Field -->
				<div>
					<label for="phone" class="mb-2 block text-sm font-medium text-gray-700"> Teléfono </label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
						</div>
						<input
							id="phone"
							type="tel"
							name="phone"
							maxlength="9"
							required
							class="block w-full rounded-lg border py-3 pl-10 pr-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
							style="focus:ring-color: #F0B35B;"
							placeholder="987654321"
						/>
					</div>
				</div>

				<!-- Email Field -->
				<div>
					<label for="email" class="mb-2 block text-sm font-medium text-gray-700">
						Correo electrónico
					</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
								/>
							</svg>
						</div>
						<input
							id="email"
							type="email"
							name="email"
							required
							class="block w-full rounded-lg border py-3 pl-10 pr-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
							style="focus:ring-color: #F0B35B;"
							placeholder="example@email.com"
						/>
					</div>
				</div>

				<!-- Password Field -->
				<div>
					<label for="password" class="mb-2 block text-sm font-medium text-gray-700">
						Contraseña
					</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
						</div>
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							name="password"
							required
							class="block w-full rounded-lg border py-3 pl-10 pr-12 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
							style="focus:ring-color: #F0B35B;"
							placeholder="Mínimo 6 caracteres"
						/>
						<button
							type="button"
							onclick={togglePasswordVisibility}
							class="absolute inset-y-0 right-0 flex items-center pr-3"
						>
							{#if showPassword}
								<svg
									class="h-5 w-5 text-gray-400 hover:text-gray-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
									/>
								</svg>
							{:else}
								<svg
									class="h-5 w-5 text-gray-400 hover:text-gray-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
							{/if}
						</button>
					</div>
				</div>

				<div class="flex items-start">
					<input
						id="terms"
						type="checkbox"
						required
						class="mt-1 h-4 w-4 rounded border-gray-300 focus:ring-2"
						style="color: #F0B35B; focus:ring-color: #F0B35B;"
					/>
					<label for="terms" class="ml-2 block text-sm text-gray-700">
						Acepto los
						<a href="#" class="hover:underline" style="color: #F0B35B;">términos y condiciones</a>
						y la
						<a href="#" class="hover:underline" style="color: #F0B35B;">política de privacidad</a>
					</label>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					class="flex w-full items-center justify-center rounded-lg border border-transparent px-4 py-3 font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					style="background-color: #04050C; focus:ring-color: #F0B35B;"
				>
					Crear cuenta
				</button>
				{#if !form?.success}
					<p class="text-center text-sm text-red-500">
						{form?.message}
					</p>
				{/if}
			</form>

			<!-- Login link -->
			<div class="mt-6 text-center">
				<p class="text-sm text-gray-600">
					¿Ya tienes una cuenta?
					<a href="/auth/login" class="font-medium hover:underline" style="color: #F0B35B;">
						Inicia sesión aquí
					</a>
				</p>
			</div>
		</div>
	</div>
</div>

{#if form?.success}
	<dialog
		class="fixed inset-0 z-10 flex h-full w-full items-center justify-center overflow-y-auto bg-black/80"
		open
	>
		<div class="flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-8">
			<p class="text-base font-medium lg:text-lg">Tu cuenta ha sido creada con éxito.</p>

			<Button url="/auth/login">Iniciar sesión</Button>
		</div>
	</dialog>
{/if}

<style>
	input:focus {
		ring-color: #f0b35b;
		border-color: #f0b35b;
	}

	input[type='checkbox']:checked {
		background-color: #f0b35b;
		border-color: #f0b35b;
	}
</style>
