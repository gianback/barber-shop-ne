<script lang="ts">
	import {
		createService,
		deleteService,
		updateService,
		updateServiceImage
	} from '$lib/api/services';
	import { formatPrice } from '$lib/client/price';
	import Header from '$lib/components/Header.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { toast, Toaster } from 'svelte-sonner';
	import Layout from '../../+layout.svelte';
	import Button from '$lib/components/Button.svelte';

	interface Service {
		id: number;
		name: string;
		description: string;
		price: number;
		image: string;
	}

	const { data } = $props();

	const { services, token } = data;

	let serviceList = $state<Service[]>(services);

	let activeUpdateModal = $state(false);

	let activeDeleteModal = $state(false);

	let activeCreateModal = $state(false);

	let activeUpdateImageModal = $state(false);

	let serviceSelected = $state<Service>({
		id: 0,
		name: '',
		description: '',
		price: 0,
		image: ''
	});

	const MODAL_TYPES = {
		CREATE: 'create',
		UPDATE: 'update',
		DELETE: 'delete',
		UPDATE_IMAGE: 'updateImage'
	};

	type ModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES];

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

	const handleServiceSelected = (service: Service, type: ModalType) => {
		serviceSelected = service;

		openModal(type);
	};

	const handleCreateService = async (event: SubmitEvent) => {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);

		const file = document.getElementById('image') as HTMLInputElement;

		const files = file.files as FileList;

		formData.append('image', files[0]);

		const { success, service } = await createService({ service: formData, token });

		if (success) {
			closeModal(MODAL_TYPES.CREATE);
			toast.success('Servicio creado');
			serviceList.push(service);
		}
	};

	const handleUpdateService = async (event: SubmitEvent) => {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);

		const fieldsToSave: Record<string, any> = {};

		const fields = ['name', 'description', 'price'] as const;

		for (const field of fields) {
			const newValue = formData.get(field);

			const parsedValue = newValue;

			if (parsedValue !== serviceSelected[field]) {
				fieldsToSave[field] = parsedValue;
			}
		}

		if (Object.keys(fieldsToSave).length === 0) return;

		const success = await updateService({
			id: serviceSelected.id,
			service: fieldsToSave,
			token
		});

		if (success) {
			closeModal(MODAL_TYPES.UPDATE);

			const servicesUpdated = services.map((service: Service) => {
				return {
					...service,
					...fieldsToSave
				};
			});
			serviceList = servicesUpdated;
			toast.success('Servicio actualizado');
		}
	};

	const handleDeleteService = async (event: SubmitEvent) => {
		event.preventDefault();

		const success = await deleteService({
			id: serviceSelected.id,
			token
		});

		if (success) {
			closeModal(MODAL_TYPES.DELETE);

			const servicesUpdated = services.filter(
				(service: Service) => service.id !== serviceSelected.id
			);
			serviceList = servicesUpdated;
			toast.success('Servicio eliminado');
		}
	};

	const handleUpdateImageService = async (event: SubmitEvent) => {
		const formData = new FormData(event.target as HTMLFormElement);

		const file = document.getElementById('imageUpdate') as HTMLInputElement;

		const files = file.files as FileList;

		formData.append('image', files[0]);

		const { success, service: serviceUpdated } = await updateServiceImage({
			token,
			image: formData,
			serviceId: serviceSelected.id
		});

		if (success) {
			closeModal(MODAL_TYPES.UPDATE_IMAGE);
			toast.success('Imagen actualizada');
			serviceList = serviceList.map((item: Service) => {
				if (item.id === serviceSelected.id) {
					return {
						...item,
						image: serviceUpdated.image
					};
				} else {
					return item;
				}
			});
		}
	};
</script>

<Layout>
	<Header />
	<main class="min-h-[calc(100vh-100px)] bg-tertiary">
		<div class="container pt-12">
			<div class="mb-8">
				<h1 class="mb-12 text-center text-4xl text-white">Mis Servicios</h1>

				<Button
					onClick={() => openModal(MODAL_TYPES.CREATE)}
					className="flex items-center justify-center gap-4"
				>
					Agregar nuevo servicio
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

			{#if services.length === 0}
				<p class="text-center text-2xl text-white">No hay servicios disponibles</p>
			{:else}
				<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table class="w-full text-left text-sm text-gray-200">
						<thead class="bg-primary text-xs uppercase text-secondary">
							<tr>
								<th scope="col" class="px-6 py-3"> Id </th>
								<th scope="col" class="px-6 py-3"> Nombre </th>
								<th scope="col" class="px-6 py-3 text-center"> Descripción </th>
								<th scope="col" class="px-6 py-3 text-center"> Precio </th>
								<th scope="col" class="px-6 py-3 text-center"> Imagen </th>
								<th scope="col" class="px-6 py-3 text-center"> Acciones </th>
							</tr>
						</thead>
						<tbody>
							{#each serviceList as service}
								<tr
									class="border-b border-gray-200 odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
								>
									<th
										scope="row"
										class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
									>
										{service.id}
									</th>
									<td class="px-6 py-4"> {service.name} </td>
									<td class="px-6 py-4"> {service.description} </td>
									<td class="px-6 py-4"> {formatPrice(service.price)} </td>
									<td class="px-6 py-4">
										<div class="group relative">
											<img
												src={service.image}
												width={200}
												height={130}
												class="max-h-[130px] max-w-[200px] object-cover"
												alt={service.name}
											/>

											<Button
												onClick={() => handleServiceSelected(service, 'updateImage')}
												className="absolute transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-100 bg-secondary left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary hover:bg-secondary"
											>
												Editar
											</Button>
										</div>
									</td>
									<td class="px-6 py-4">
										<div class="flex items-center gap-4">
											<button
												onclick={() => handleServiceSelected(service, 'update')}
												class="rounded-lg bg-blue-500 px-4 py-2 text-primary"
											>
												Editar
											</button>
											<button
												onclick={() => handleServiceSelected(service, 'delete')}
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

{#if activeUpdateModal}
	<Modal onClose={() => closeModal(MODAL_TYPES.UPDATE)}>
		<form class="flex flex-col gap-4" onsubmit={handleUpdateService}>
			<div>
				<label for="name" class="mb-2 block text-sm font-medium text-gray-700"> Nombre </label>
				<input
					type="text"
					id="name"
					name="name"
					defaultValue={serviceSelected.name}
					class="block w-full rounded-lg border px-4 py-3 pr-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
					placeholder="Nombre del servicio"
				/>
			</div>
			<div>
				<label for="description" class="mb-2 block text-sm font-medium text-gray-700">
					Descripción
				</label>
				<textarea
					id="description"
					name="description"
					placeholder="Descripción del servicio"
					class="block w-full rounded-lg border px-4 py-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
					rows={5}>{serviceSelected.description.replace(/[\s]{2,}/gi, '')}</textarea
				>
			</div>
			<div>
				<input
					type="number"
					id="price"
					maxlength="4"
					min="0"
					name="price"
					class="block w-full rounded-lg border px-4 py-3 pr-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
					defaultValue={serviceSelected.price}
					placeholder="Precio del servicio"
				/>
			</div>

			<Button type="submit">Guardar</Button>
		</form>
	</Modal>
{/if}

{#if activeDeleteModal}
	<Modal onClose={() => closeModal(MODAL_TYPES.DELETE)}>
		<p>¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.</p>
		<div class="flex items-center justify-center gap-4 lg:flex-row">
			<Button onClick={handleDeleteService}>Si, eliminar</Button>
			<Button onClick={() => closeModal(MODAL_TYPES.DELETE)}>Cancelar</Button>
		</div>
	</Modal>
{/if}

{#if activeCreateModal}
	<Modal onClose={() => closeModal(MODAL_TYPES.CREATE)}>
		<form class="flex flex-col gap-4" onsubmit={handleCreateService}>
			<div>
				<label for="name" class="mb-2 block text-sm font-medium text-gray-700"> Nombre </label>
				<input
					type="text"
					id="name"
					name="name"
					required
					class="block w-full rounded-lg border px-4 py-3 pr-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
					placeholder="Nombre del servicio"
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
					placeholder="Descripción del servicio"
					class="block w-full rounded-lg border px-4 py-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
					rows={5}
				></textarea>
			</div>
			<div>
				<label for="price" class="mb-2 block text-sm font-medium text-gray-700"> Precio </label>
				<input
					type="number"
					id="price"
					maxlength="4"
					min="0"
					name="price"
					class="block w-full rounded-lg border px-4 py-3 pr-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
					placeholder="Precio del servicio"
				/>
			</div>

			<div>
				<label class="mb-2 block text-sm font-medium text-gray-900" for="image"
					>Imagen del servicio</label
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

{#if activeUpdateImageModal}
	<Modal onClose={() => closeModal(MODAL_TYPES.UPDATE_IMAGE)}>
		<form class="flex flex-col gap-4" onsubmit={handleUpdateImageService}>
			<div>
				<label for="imageUpdate" class="mb-2 block text-sm font-medium text-gray-700">
					Imagen
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
<Toaster richColors={true} position="bottom-right" />

<style>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		/* display: none; <- Crashes Chrome on hover */
		-webkit-appearance: none;
		margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
	}

	input[type='number'] {
		-moz-appearance: textfield; /* Firefox */
	}
</style>
