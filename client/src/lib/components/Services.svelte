<script lang="ts">
	import { formatPrice } from '$lib/client/price';

	const { services } = $props();
</script>

<section class="bg-white py-36">
	<div class="container">
		<h2 class="mb-8 text-center text-2xl font-bold text-tertiary lg:text-4xl">Servicios</h2>

		<p class="mx-auto max-w-[75ch] text-center text-sm text-tertiary lg:text-base">
			Lorem ipsum dolor sit amet consectetur. Etiam mus vitae lectus proin pellentesque mattis
			iaculis. In viverra accumsan sagittis tempus duis a. Sagittis mollis a eu urna eget id.
		</p>

		<div class="mx-auto mt-20 grid max-w-[80%] grid-cols-3 gap-16">
			{#each services as service (service.id)}
				<article class="overflow-hidden rounded-md shadow-[0_5px_15px_5px_rgba(0,0,0,0.2)]">
					<img
						class="w-full object-cover"
						width={367}
						height={423}
						src={service.image}
						alt={service.name}
					/>
					<div class="p-4">
						<div class="mb-4 flex items-center justify-between">
							<h3 class=" text-xl font-bold">{service.name}</h3>
							<span class="rounded-xl bg-primary p-1.5 text-white"
								>{formatPrice(service.price)}</span
							>
						</div>
						<p class="mb-6 font-light">{service.description}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
