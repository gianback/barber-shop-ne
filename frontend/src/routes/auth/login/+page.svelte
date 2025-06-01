<script lang="ts">
	import { page } from '$app/state';
	import Layout from '../../+layout.svelte';

	const { form } = $props();

	let showPassword = $state(false);

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}
</script>

<Layout>
	<div
		class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4"
	>
		<div class="w-full max-w-md">
			<div class="mb-8 text-center">
				<div
					class="mb-4 inline-flex items-center justify-center rounded-md p-2"
					style="background-color: #04050C;"
				>
					<img src="/images/logo.png" alt="Logo barberia" />
				</div>
				<h1 class="text-3xl font-bold text-gray-900">Bienvenido</h1>
				<p class="mt-2 text-gray-600">Inicia sesión en tu cuenta</p>
			</div>

			<!-- Login Form -->
			<div class="rounded-2xl bg-white p-8 shadow-xl">
				<form method="POST" action="?/login" class="space-y-6">
					<!-- Username Field -->
					<div>
						<label for="username" class="mb-2 block text-sm font-medium text-gray-700">
							Email
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
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
							</div>
							<input
								id="email"
								type="email"
								required
								class="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
								style="focus:ring-color: #F0B35B;"
								placeholder="Ingresa tu usuario"
								name="email"
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
								required
								name="password"
								class="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-12 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
								style="focus:ring-color: #F0B35B;"
								placeholder="Ingresa tu contraseña"
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

					<!-- Submit Button -->
					<!-- disabled={isLoading} -->
					<button
						type="submit"
						class="flex w-full items-center justify-center rounded-lg border border-transparent px-4 py-3 font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						style="background-color: #04050C; focus:ring-color: #F0B35B;"
					>
						Iniciar sesión
					</button>
					{#if !form?.success}
						<p class="text-center text-sm text-red-500">
							{form?.message}
						</p>
					{/if}
				</form>

				<!-- Sign up link -->
				<div class="mt-6 text-center">
					<p class="text-sm text-gray-600">
						¿No tienes una cuenta?
						<a href="/auth/register" class="font-medium hover:underline" style="color: #F0B35B;">
							Regístrate aquí
						</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</Layout>

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
