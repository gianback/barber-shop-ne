<script>
	import Image1 from '$lib/assets/about-1.png';
	import Image2 from '$lib/assets/about-2.png';
	import Image3 from '$lib/assets/about-3.png';
</script>

<section class="bg-tertiary pb-36 pt-20">
	<div class="container grid grid-cols-2 place-items-center">
		<div class="grid grid-cols-2">
			<img
				class="col-span-2 mx-auto -translate-x-32 translate-y-10"
				src={Image1}
				alt="Hombre cortando cabello"
			/>
			<img src={Image2} alt="Hombre brindando un servicio de barba" />
			<img src={Image3} alt="Hombre cortando cabello" />
		</div>
		<div class="space-y-4 [&>p]:text-sm [&>p]:text-white [&>p]:lg:text-base">
			<h2 class="mb-8 text-2xl font-bold text-white lg:text-4xl">Sobre nosotros</h2>
			<p>
				Lorem ipsum dolor sit amet consectetur. Sed vitae egestas risus in eleifend porttitor nam.
				Amet ut dictumst commodo aliquam eget augue at mi. Commodo sollicitudin ultrices ut nulla
				venenatis quam at.
			</p>
			<p>
				Lorem ipsum dolor sit amet consectetur. Sed vitae egestas risus in eleifend porttitor nam.
				Amet ut dictumst commodo aliquam eget augue at mi. Commodo sollicitudin ultrices ut nulla
				venenatis quam at.
			</p>
			<p class="font-bold">Horário de funcionamento 09: as 18:00</p>
		</div>
	</div>
</section>
