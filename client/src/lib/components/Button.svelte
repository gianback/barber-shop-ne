<script lang="ts">
	let { children, url = null, type = 'button', onClick = null, className = '' } = $props();

	const tag = url ? 'a' : 'button';
</script>

<svelte:element
	this={tag}
	href={url}
	{type}
	onclick={onClick}
	class="{className} rounded-md bg-secondary px-8 py-3 text-center hover:bg-secondary/90"
>
	{@render children()}
</svelte:element>
