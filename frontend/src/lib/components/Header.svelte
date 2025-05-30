<script lang="ts">
	import Logo from '$lib/assets/logo.png';
	import Button from './Button.svelte';
</script>

<header class="bg-primary py-4">
	<div class="container flex items-center justify-between">
		<img src={Logo} alt="Logo barberia" />

		<Button>Agendar cita</Button>
	</div>
</header>
