<script lang="ts">
	import { createBlog, deleteBlog, updateBlog, updateBlogImage } from '$lib/api/blogs';
	import Button from '$lib/components/Button.svelte';
	import Header from '$lib/components/Header.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { toast, Toaster } from 'svelte-sonner';
	import Layout from '../../+layout.svelte';

	const { data } = $props();
	const { blogs, token } = data;

	interface Blog {
		id: number;
		title: string;
		description: string;
		description_small: string;
		image: string;
		created_at: string;
		slug: string;
	}

	const MODAL_TYPES = {
		CREATE: 'create',
		UPDATE: 'update',
		DELETE: 'delete',
		UPDATE_IMAGE: 'updateImage'
	};
	type ModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES];

	let blogList = $state<Blog[]>(blogs);

	let initialState: Blog = {
		id: 0,
		title: '',
		description: '',
		description_small: '',
		image: '',
		created_at: '',
		slug: ''
	};

	let blogSelected = $state<Blog>(initialState);

	let activeCreateModal = $state(false);
	let activeUpdateModal = $state(false);
	let activeDeleteModal = $state(false);
	let activeUpdateImageModal = $state(false);

	const openModal = (type: ModalType) => {
		if (type === MODAL_TYPES.CREATE) {
			activeCreateModal = true;
		} else if (type === MODAL_TYPES.UPDATE) {
			activeUpdateModal = true;
		} else if (type === MODAL_TYPES.DELETE) {
			activeDeleteModal = true;
		} else if (type === MODAL_TYPES.UPDATE_IMAGE) {
			activeUpdateImageModal = true;
		}
	};

	const closeModal = (type: ModalType) => {
		if (type === MODAL_TYPES.CREATE) {
			activeCreateModal = false;
		} else if (type === MODAL_TYPES.UPDATE) {
			activeUpdateModal = false;
		} else if (type === MODAL_TYPES.DELETE) {
			activeDeleteModal = false;
		} else if (type === MODAL_TYPES.UPDATE_IMAGE) {
			activeUpdateImageModal = false;
		}
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(date);
	};

	const handleServiceSelected = (blog: Blog, type: ModalType) => {
		blogSelected = blog;

		openModal(type);
	};

	const handleCreateBlog = async (event: SubmitEvent) => {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);

		const file = document.getElementById('image') as HTMLInputElement;

		const files = file.files as FileList;

		formData.append('image', files[0]);

		const { success, blog } = await createBlog({ blog: formData, token });

		if (success) {
			closeModal(MODAL_TYPES.CREATE);
			toast.success('Blog creado');
			blogList.push(blog);
			blogSelected = initialState;
		}
	};

	const handleUpdateBlog = async (event: SubmitEvent) => {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);

		const fieldsToSave: Record<string, any> = {};

		const fields = ['title', 'description', 'description_small'] as const;

		for (const field of fields) {
			const newValue = formData.get(field);

			const parsedValue = newValue;

			if (parsedValue !== blogSelected[field as keyof Blog]) {
				fieldsToSave[field] = parsedValue;
			}
		}

		if (Object.keys(fieldsToSave).length === 0) return;

		const success = await updateBlog({
			id: blogSelected.id,
			blog: fieldsToSave,
			token
		});

		if (success) {
			closeModal(MODAL_TYPES.UPDATE);

			const blogsUpdated = blogs.map((item: Blog) => {
				if (item.id === blogSelected.id) {
					return {
						...item,
						...fieldsToSave
					};
				} else {
					return item;
				}
			});
			blogList = blogsUpdated;
			toast.success('Blog actualizado');

			blogSelected = initialState;
		}
	};

	const handleUpdateImageBlog = async (event: SubmitEvent) => {
		event.preventDefault();

		const imageUpdate = document.getElementById('imageUpdate') as HTMLInputElement;

		const files = imageUpdate.files as FileList;

		const formData = new FormData();

		formData.append('image', files[0]);

		const { success, blog: blogUpdated } = await updateBlogImage({
			token,
			image: formData,
			blogId: blogSelected.id
		});

		if (success) {
			closeModal(MODAL_TYPES.UPDATE_IMAGE);
			toast.success('Imagen actualizada');
			blogList = blogList.map((item: Blog) => {
				if (item.id === blogSelected.id) {
					return {
						...item,
						image: blogUpdated.image
					};
				} else {
					return item;
				}
			});
			blogSelected = initialState;
		}
	};

	const handleDeleteBlog = async (event: SubmitEvent) => {
		event.preventDefault();

		const success = await deleteBlog({
			id: blogSelected.id,
			token
		});

		if (success) {
			closeModal(MODAL_TYPES.DELETE);

			const blogsUpdated = blogs.filter((blog: Blog) => blog.id !== blogSelected.id);
			blogList = blogsUpdated;
			toast.success('Blog eliminado');

			blogSelected = initialState;
		}
	};
</script>

<Layout>
	<Header />
	<main class="min-h-[calc(100vh-100px)] bg-tertiary">
		<div class="container pt-12">
			<div class="mb-8">
				<h1 class="mb-12 text-center text-4xl text-white">Mis Blogs</h1>

				<Button
					onClick={() => openModal(MODAL_TYPES.CREATE)}
					className="flex items-center justify-center gap-4"
				>
					Agregar nuevo blog
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
						fill="currentColor"
						><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg
					>
				</Button>
			</div>

			{#if blogs.length === 0}
				<p class="text-center text-2xl text-white">No hay servicios disponibles</p>
			{:else}
				<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table class="w-full text-left text-sm text-gray-200">
						<thead class="bg-primary text-xs uppercase text-secondary">
							<tr>
								<th scope="col" class="px-6 py-3"> Id </th>
								<th scope="col" class="px-6 py-3"> Tituloo </th>
								<th scope="col" class="px-6 py-3 text-center"> Descripción </th>
								<th scope="col" class="px-6 py-3 text-center"> Descripción corta </th>
								<th scope="col" class="px-6 py-3 text-center"> Imagen </th>
								<th scope="col" class="px-6 py-3 text-center"> Fecha de creación </th>
								<th scope="col" class="px-6 py-3 text-center"> Acciones </th>
							</tr>
						</thead>
						<tbody>
							{#each blogList as blog}
								<tr
									class="border-b border-gray-200 odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
								>
									<th
										scope="row"
										class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
									>
										{blog.id}
									</th>
									<td class="px-6 py-4"> {blog.title} </td>
									<td class="px-6 py-4"> {blog.description} </td>
									<td class="px-6 py-4"> {blog.description_small} </td>
									<td class="px-6 py-4">
										<div class="group relative">
											<img
												src={blog.image}
												width={200}
												height={130}
												class="max-h-[130px] max-w-[200px] object-cover"
												alt={blog.title}
											/>

											<Button
												onClick={() => handleServiceSelected(blog, 'updateImage')}
												className="absolute transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-100 bg-secondary left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary hover:bg-secondary"
											>
												Editar
											</Button>
										</div>
									</td>
									<td class="px-6 py-4"> {formatDate(new Date(blog.created_at))} </td>

									<td class="px-6 py-4">
										<div class="flex items-center gap-4">
											<button
												onclick={() => handleServiceSelected(blog, 'update')}
												class="rounded-lg bg-blue-500 px-4 py-2 text-primary"
											>
												Editar
											</button>
											<button
												onclick={() => handleServiceSelected(blog, 'delete')}
												class="rounded-lg bg-red-500 px-4 py-2 text-primary">Eliminar</button
											>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</main>
</Layout>

{#if activeCreateModal}
	<Modal onClose={() => closeModal(MODAL_TYPES.CREATE)}>
		<form class="flex flex-col gap-4" onsubmit={handleCreateBlog}>
			<div>
				<label for="title" class="mb-2 block text-sm font-medium text-gray-700"> Titulo </label>
				<input
					type="text"
					id="title"
					name="title"
					required
					class="block w-full rounded-lg border px-4 py-3 pr-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
					placeholder="Titulo del blog"
				/>
			</div>
			<div>
				<label for="description" class="mb-2 block text-sm font-medium text-gray-700">
					Descripción
				</label>
				<textarea
					id="description"
					name="description"
					required
					placeholder="Descripción del blog"
					class="block w-full rounded-lg border px-4 py-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
					rows={5}
				></textarea>
			</div>
			<div>
				<label for="description_small" class="mb-2 block text-sm font-medium text-gray-700">
					Descripción corta
				</label>
				<textarea
					id="description_small"
					name="description_small"
					required
					placeholder="Descripción corta del blog"
					class="block w-full rounded-lg border px-4 py-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
					rows={5}
				></textarea>
			</div>

			<div>
				<label class="mb-2 block text-sm font-medium text-gray-900" for="image"
					>Imagen del blog</label
				>
				<input
					class="block w-full border border-gray-300 bg-gray-50 text-sm text-gray-900 outline-none focus:outline-none"
					id="image"
					type="file"
					accept="image/jpeg, image/png, image/jpg, image/webp"
				/>
			</div>

			<Button type="submit">Crear</Button>
		</form>
	</Modal>
{/if}

{#if activeUpdateModal}
	<Modal onClose={() => closeModal(MODAL_TYPES.UPDATE)}>
		<form class="flex flex-col gap-4" onsubmit={handleUpdateBlog}>
			<div>
				<label for="title" class="mb-2 block text-sm font-medium text-gray-700"> Nombre </label>
				<input
					type="text"
					id="title"
					name="title"
					defaultValue={blogSelected.title}
					class="block w-full rounded-lg border px-4 py-3 pr-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
					placeholder="Nombre del blog"
				/>
			</div>
			<div>
				<label for="description" class="mb-2 block text-sm font-medium text-gray-700">
					Descripción
				</label>
				<textarea
					id="description"
					name="description"
					placeholder="Descripción del blog"
					class="block w-full rounded-lg border px-4 py-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
					rows={5}>{blogSelected.description.replace(/[\s]{2,}/gi, '')}</textarea
				>
			</div>
			<div>
				<label for="description_small" class="mb-2 block text-sm font-medium text-gray-700">
					Descripción corta
				</label>
				<input
					type="text"
					id="description_small"
					maxlength="4"
					min="0"
					name="description_small"
					class="block w-full rounded-lg border px-4 py-3 pr-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
					defaultValue={blogSelected.description_small}
					placeholder="Precio del blog"
				/>
			</div>

			<Button type="submit">Guardar</Button>
		</form>
	</Modal>
{/if}

{#if activeUpdateImageModal}
	<Modal onClose={() => closeModal(MODAL_TYPES.UPDATE_IMAGE)}>
		<form class="flex flex-col gap-4" onsubmit={handleUpdateImageBlog}>
			<div>
				<label for="imageUpdate" class="mb-2 block text-sm font-medium text-gray-700">
					Imagen del blog
				</label>
				<input
					class="block w-full border border-gray-300 bg-gray-50 text-sm text-gray-900 outline-none focus:outline-none"
					id="imageUpdate"
					type="file"
					accept="image/jpeg, image/png, image/jpg, image/webp"
				/>
			</div>

			<Button type="submit">Actualizar</Button>
		</form></Modal
	>
{/if}

{#if activeDeleteModal}
	<Modal onClose={() => closeModal(MODAL_TYPES.DELETE)}>
		<p>¿Estás seguro de que deseas eliminar este blog? Esta acción no se puede deshacer.</p>
		<div class="flex items-center justify-center gap-4 lg:flex-row">
			<Button onClick={handleDeleteBlog}>Si, eliminar</Button>
			<Button onClick={() => closeModal(MODAL_TYPES.DELETE)}>Cancelar</Button>
		</div>
	</Modal>
{/if}

<Toaster richColors={true} position="bottom-right" />
