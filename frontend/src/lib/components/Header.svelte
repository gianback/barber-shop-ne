<script lang="ts">
	import { page } from '$app/state';
	import Button from './Button.svelte';

	const { user } = $derived(page.data);

	let admin = false;

	if (user?.role === 'admin') {
		admin = true;
	}
</script>

<header class="bg-primary py-4">
	<div class="container flex items-center justify-between">
		<a href="/">
			<img src="/images/logo.png" alt="Logo barberia" />
		</a>

		{#if admin}
			<ul class="flex items-center gap-8 text-xl text-white">
				<li>
					<a href="/admin/services">Servicios</a>
				</li>
				<li>
					<a href="/admin/blogs">Blogs</a>
				</li>
			</ul>
		{/if}

		<div class="flex items-center gap-8">
			{#if user}
				<div class="flex items-center gap-2">
					<div class="text-md text-end leading-tight [&>p]:text-white">
						<p>Hola</p>
						<p>{user.name}</p>
					</div>
					<div
						class="flex size-10 items-center justify-center rounded-full border border-secondary bg-secondary p-1"
					>
						{#if user.avatar}
							<img src={user.avatar} alt={`Avatar de ${user.name}`} />
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="35px"
								viewBox="0 -960 960 960"
								width="35px"
								fill="#fff"
								><path
									d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"
								/></svg
							>
						{/if}
					</div>
				</div>
			{:else}
				<Button url="/auth/login">Iniciar sesión</Button>
			{/if}

			<Button>Agendar cita</Button>
		</div>
	</div>
</header>
