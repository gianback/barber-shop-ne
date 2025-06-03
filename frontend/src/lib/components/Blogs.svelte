<script lang="ts">
	const { blogs } = $props();
</script>

<section class="bg-primary py-36">
	<div class="container">
		<h2 class="mb-8 text-center text-2xl font-bold text-white lg:text-4xl">Blogs</h2>

		<p class="mx-auto max-w-[75ch] text-center text-sm text-white lg:text-base">
			Lorem ipsum dolor sit amet consectetur. Etiam mus vitae lectus proin pellentesque mattis
			iaculis. In viverra accumsan sagittis tempus duis a. Sagittis mollis a eu urna eget id.
		</p>

		<div class="mx-auto mt-20 grid max-w-[80%] grid-cols-3 gap-16">
			{#each blogs as service (service.id)}
				<a
					href="/blog/{service.id}-{service.slug}"
					class="group overflow-hidden rounded-md shadow-[0_5px_15px_5px_rgba(0,0,0,0.2)]"
				>
					<picture class="flex items-center justify-center overflow-hidden">
						<img
							class="w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
							width={367}
							height={423}
							src={service.image}
							alt={service.title}
						/>
					</picture>
					<div class="bg-white p-4">
						<div class="mb-4 flex items-center justify-between">
							<h3 class=" text-xl font-bold">{service.title}</h3>
						</div>
						<p class="mb-6 font-light">{service.description_small}</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>
