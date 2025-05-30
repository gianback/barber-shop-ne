<script>
	import Banner from '$lib/assets/banner.png';
	import Button from './Button.svelte';
</script>

<section
	class="flex h-[calc(100vh-100px)] items-center justify-center bg-cover bg-center bg-no-repeat"
	style="background-image: url({Banner});"
>
	<div class="flex flex-col items-center">
		<h1 class="mx-auto max-w-[45ch] text-center text-3xl font-bold text-white lg:text-5xl">
			ESTILO É UM REFLEXO DA SUA ATITUDE E SUA PERSONALIDADE
		</h1>
		<p class="my-4 text-xl text-white lg:text-3xl">Hórario de funcionamento: 09:00 às 18:00</p>
		<Button>Agendar cita</Button>
	</div>
</section>
