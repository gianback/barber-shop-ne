<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Layout from '../../+layout.svelte';

	const { data } = $props();

	const { blog } = data;

	const formatDate = (date: Date) => {
		const dateFormated = new Date(date);

		return new Intl.DateTimeFormat('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(dateFormated);
	};
</script>

<svelte:head>
	<title>{blog.title} - Barbería</title>
	<meta name="description" content={blog.description_small} />
</svelte:head>
<Layout>
	<Header />
	<div class="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
		<a
			href="/"
			class="inline-flex items-center font-medium text-amber-600 transition-colors hover:text-amber-700"
		>
			<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"
				></path>
			</svg>
			Volver
		</a>
	</div>
	<main class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
		<article class=" overflow-hidden rounded-lg bg-white shadow-lg">
			<!-- Imagen principal -->
			<div class="aspect-video overflow-hidden">
				<img
					src={blog.image || '/placeholder.svg'}
					alt={blog.title}
					class="h-full w-full object-cover"
				/>
			</div>

			<!-- Contenido del artículo -->
			<div class="p-8 lg:p-12">
				<!-- Metadatos -->
				<div class="mb-6 flex items-center text-sm text-gray-500">
					<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						></path>
					</svg>
					<span class="mr-4">{formatDate(blog.created_at)}</span>

					<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					<span>5 min de lectura</span>
				</div>

				<!-- Título principal -->
				<h1 class="mb-4 text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">
					{blog.title}
				</h1>

				<!-- Descripción pequeña (subtítulo) -->
				<p class="mb-8 text-xl font-medium leading-relaxed text-amber-600">
					{blog.description_small}
				</p>

				<!-- Contenido principal -->
				<div class="prose prose-lg max-w-none">
					<p class="mb-6 text-lg leading-relaxed text-gray-700">
						{blog.description}
					</p>

					<!-- Contenido adicional del artículo -->
					<div class="space-y-6">
						<h2 class="mb-4 mt-8 text-2xl font-bold text-gray-900">
							¿Por qué elegir nuestros servicios?
						</h2>

						<p class="leading-relaxed text-gray-700">
							En nuestra barbería, cada corte es una obra de arte. Nuestros barberos profesionales
							tienen años de experiencia y están constantemente actualizándose con las últimas
							tendencias y técnicas del sector.
						</p>

						<div class="my-8 border-l-4 border-amber-400 bg-amber-50 p-6">
							<div class="flex">
								<div class="flex-shrink-0">
									<svg class="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
								<div class="ml-3">
									<p class="text-sm text-amber-700">
										<strong>Consejo profesional:</strong> Recuerda que cada tipo de cabello es único.
										Lo que funciona para otros puede no ser lo ideal para ti. Siempre consulta con un
										profesional.
									</p>
								</div>
							</div>
						</div>

						<h3 class="mb-3 mt-6 text-xl font-semibold text-gray-900">Servicios relacionados</h3>

						<ul class="list-inside list-disc space-y-2 text-gray-700">
							<li>Cortes clásicos y modernos</li>
							<li>Arreglo y diseño de barba</li>
							<li>Tratamientos capilares</li>
							<li>Asesoramiento personalizado de estilo</li>
						</ul>

						<!-- <div class="mt-8 rounded-lg bg-gray-900 p-8 text-white">
							<h3 class="mb-4 text-xl font-bold">¿Listo para tu nuevo look?</h3>
							<p class="mb-6">Reserva tu cita y déjanos ayudarte a lucir tu mejor versión.</p>
							<button
								class="rounded-lg bg-amber-600 px-6 py-3 font-bold text-white transition-colors hover:bg-amber-700"
							>
								Reservar cita
							</button>
						</div> -->
					</div>
				</div>
			</div>
		</article>
	</main>
</Layout>
