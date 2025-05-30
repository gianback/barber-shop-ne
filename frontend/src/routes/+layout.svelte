<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '@fontsource/poppins';
	import '../app.css';
	import '@fontsource/poppins/300.css';
	import '@fontsource/poppins/400.css';
	import '@fontsource/poppins/500.css';
	import '@fontsource/poppins/600.css';
	import '@fontsource/poppins/700.css';
	let { children } = $props();
</script>

<Header />
{@render children()}
