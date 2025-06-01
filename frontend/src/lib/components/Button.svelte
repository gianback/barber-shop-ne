<script lang="ts">
	let { children, url } = $props();

	const tag = url ? 'a' : 'button';
</script>

<svelte:element
	this={tag}
	href={url}
	class="rounded-md bg-secondary px-8 py-3 text-center hover:bg-secondary/90"
>
	{@render children()}
</svelte:element>
