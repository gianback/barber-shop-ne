<script lang="ts">
	let { children, onClose } = $props();
</script>

<dialog
	class="fixed inset-0 z-10 flex h-full w-full items-center justify-center overflow-y-auto bg-black/80"
	open
>
	<div class="relative flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-12">
		{@render children()}

		<button
			onclick={onClose}
			class="absolute right-3 top-3 flex size-8 items-center justify-center rounded-md bg-secondary text-lg leading-none"
		>
			x
		</button>
	</div>
</dialog>
