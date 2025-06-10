<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { DatePicker } from '@svelte-plugins/datepicker';
	import Layout from '../../+layout.svelte';
	import { format } from 'date-fns';
	import Button from '$lib/components/Button.svelte';
	import { deleteAppointment, editAppointment } from '$lib/api/appointment';
	import { toast, Toaster } from 'svelte-sonner';
	import { createCheckoutSession } from '$lib/api/checkout';
	import { goto } from '$app/navigation';

	const { data } = $props();

	const { appointments, services, token } = data;

	const MODAL_TYPES = {
		UPDATE: 'update',
		DELETE: 'delete'
	};

	type Appointment = {
		id: number;
		date: Date;
		service: {
			id: number;
			name: string;
		};
		user: {
			id: number;
		};
		paid: boolean;
	};
	type ModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES];

	let appointmentList = $state<Appointment[]>(appointments);
	let dateFormat = 'MM/dd/yy';

	let timeList = $state<{ hour: string; iso: string }[]>([]);
	const getTimes = async (data: string) => {
		const response = await fetch(`http://localhost:3000/appointments/date/${data}`);

		const times = await response.json();

		timeList = times;
	};

	let initialState: Appointment = {
		id: 0,
		date: new Date(),
		paid: false,
		service: {
			id: 0,
			name: ''
		},
		user: {
			id: 0
		}
	};
	const toggleDatePicker = () => (isOpen = !isOpen);

	const formatDate = (dateString: Date) => {
		if (isNaN(new Date(dateString).getTime())) {
			return '';
		}

		return (dateString && format(new Date(dateString), dateFormat)) || '';
	};
	let startDate = $state<Date | undefined>();

	let appointmentSelected = $state<Appointment>(initialState);
	let formattedStartDate = $derived(formatDate(appointmentSelected.date));

	let activeUpdateAppointmentModal = $state(false);
	let activeDeleteAppointmentModal = $state(false);

	let isOpen = $state(false);
	let timeSelected = $state<string>('');

	let dateSelectedToUpdate = $state<Date | undefined | string>();

	const handleAppointmentSelected = (appointment: Appointment, type: ModalType) => {
		appointmentSelected = appointment;

		openModal(type);
	};

	const openModal = (type: ModalType) => {
		if (type === MODAL_TYPES.UPDATE) {
			activeUpdateAppointmentModal = true;
		} else if (type === MODAL_TYPES.DELETE) {
			activeDeleteAppointmentModal = true;
		}
	};

	const closeModal = (type: ModalType) => {
		if (type === MODAL_TYPES.UPDATE) {
			activeUpdateAppointmentModal = false;
		} else if (type === MODAL_TYPES.DELETE) {
			activeDeleteAppointmentModal = false;
		}
	};

	$effect(() => {
		if (startDate) {
			const ios = new Date(startDate!).toISOString();
			getTimes(ios);
		}
	});

	const handleEditAppointment = async (e: Event) => {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);

		const fieldsToSave: Record<string, any> = {};

		if (formData.get('service')) {
			fieldsToSave.serviceId = Number(formData.get('service'));
		}
		if (formData.get('time')) {
			const date = formData.get('time') as string;

			fieldsToSave.date = new Date(date).toISOString();
		}

		const { success, message, appointment } = await editAppointment(
			fieldsToSave,
			token,
			appointmentSelected.id
		);

		if (success) {
			closeModal(MODAL_TYPES.UPDATE);
			toast.success(message);
			appointmentList = appointmentList.map((item: Appointment) => {
				if (item.id === appointmentSelected.id) {
					return {
						...item,
						...fieldsToSave
					};
				} else {
					return item;
				}
			});
			appointmentSelected = initialState;
		}
	};

	const handleDateChange = (e: any) => {
		const date = format(e.startDate, dateFormat);

		dateSelectedToUpdate = date;
	};

	const handleDeleteAppointment = async () => {
		const { success, message } = await deleteAppointment(appointmentSelected.id, token);

		if (success) {
			closeModal(MODAL_TYPES.DELETE);
			toast.success(message);
			appointmentList = appointmentList.filter(
				(appointment: Appointment) => appointment.id !== appointmentSelected.id
			);
			appointmentSelected = initialState;
		}
	};

	const handlePayment = async (appointment: Appointment) => {
		const { url } = await createCheckoutSession({
			serviceId: appointment.service.id,
			appointmentId: appointment.id,
			token
		});

		window.location = url;
	};
</script>

<Header />
<Layout>
	<section class="pt-12">
		<h1 class="mb-12 text-center text-4xl font-bold text-primary">Lista de citas</h1>
		<div class="container">
			<table class="w-full text-left text-sm text-gray-200">
				<thead class="bg-primary text-xs uppercase text-secondary">
					<tr>
						<th scope="col" class="px-6 py-3 text-center"> Id </th>
						<th scope="col" class="px-6 py-3 text-center"> Fecha </th>
						<th scope="col" class="px-6 py-3 text-center"> Pagado </th>
						<th scope="col" class="px-6 py-3 text-center"> Acciones </th>
					</tr>
				</thead>
				<tbody>
					{#each appointmentList as appointment}
						<tr
							class="border-b border-gray-200 odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
						>
							<td
								scope="row"
								class="whitespace-nowrap px-6 py-4 text-center font-medium text-gray-900 dark:text-white"
							>
								{appointment.id}
							</td>
							<td
								scope="row"
								class="whitespace-nowrap px-6 py-4 text-center font-medium text-gray-900 dark:text-white"
							>
								{new Intl.DateTimeFormat('es-ES', {
									hour: '2-digit',
									minute: '2-digit',
									hour12: true,
									day: 'numeric',
									month: 'long',
									year: 'numeric'
								}).format(new Date(appointment.date))}
							</td>
							<td
								scope="row"
								class="whitespace-nowrap px-6 py-4 text-center font-medium text-gray-900 dark:text-white"
							>
								{appointment.paid ? 'Si' : 'No'}
							</td>
							<td
								scope="row"
								class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
							>
								<div class="flex items-center justify-center gap-4">
									<button
										onclick={() => handleAppointmentSelected(appointment, 'update')}
										class="rounded-lg bg-blue-500 px-4 py-2 text-primary"
									>
										Editar
									</button>
									<button
										onclick={() => handleAppointmentSelected(appointment, 'delete')}
										class="rounded-lg bg-red-500 px-4 py-2 text-primary">Eliminar</button
									>
									{#if !appointment?.paid}
										<Button onClick={() => handlePayment(appointment)} className="text-primary"
											>Pagar</Button
										>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</Layout>

{#if activeUpdateAppointmentModal}
	<Modal onClose={() => closeModal(MODAL_TYPES.UPDATE)}>
		<form class="flex flex-col gap-4" onsubmit={handleEditAppointment}>
			<div class="space-y-4">
				<p class="text-lg leading-none text-primary">Selecciona una servicio</p>
				<div class="grid grid-cols-3">
					{#each services as service}
						<label
							for={service.id}
							class="flex justify-start gap-4 rounded-md border-2 border-solid px-2 text-center text-lg text-primary transition-all duration-300 ease-out {service.id ===
							appointmentSelected.service.id
								? 'border-secondary'
								: 'border-transparent'}"
						>
							<input
								type="radio"
								name="service"
								id={service.id}
								required
								class="bg-primary accent-secondary"
								bind:group={appointmentSelected.service.id}
								value={service.id}
								checked={service.id === appointmentSelected.service.id}
							/>
							{service.name}
						</label>
					{/each}
				</div>
			</div>
			<div class="space-y-4">
				<label for="date" class="text-lg leading-none text-primary">Selecciona una fecha</label>
				<DatePicker
					id="date"
					enablePastDates={false}
					disabledDates={[formatDate(new Date())]}
					enableFutureDates={true}
					startOfWeek="1"
					onDayClick={handleDateChange}
					bind:isOpen
					bind:startDate
				>
					<input
						class="w-full text-lg"
						type="text"
						name="date"
						placeholder="Fecha"
						autocomplete="off"
						defaultvalue={dateSelectedToUpdate || formatDate(appointmentSelected.date)}
						onclick={toggleDatePicker}
					/>
				</DatePicker>
			</div>
			<div>
				{#if timeList.length > 0}
					<div class="space-y-4">
						<p class="text-lg text-primary">Hora</p>
						<div class="grid grid-cols-2">
							{#each timeList as time}
								<label
									for={time.hour}
									class="flex justify-center gap-4 rounded-md border-2 border-solid text-center text-lg text-primary transition-all duration-300 ease-out {time.iso ===
									timeSelected
										? 'border-secondary'
										: 'border-transparent'}"
								>
									<input
										type="radio"
										name="time"
										id={time.hour}
										class="bg-primary accent-secondary"
										bind:group={timeSelected}
										value={time.iso}
										checked={time.iso === timeSelected}
									/>
									{time.hour}:00
								</label>
							{/each}
						</div>
					</div>
				{/if}
				<Button type="submit" className="w-full">Actualizar</Button>
			</div>
		</form>
	</Modal>
{/if}

{#if activeDeleteAppointmentModal}
	<Modal onClose={() => closeModal(MODAL_TYPES.DELETE)}>
		<p>¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer.</p>
		<div class="flex items-center justify-center gap-4 lg:flex-row">
			<Button onClick={handleDeleteAppointment}>Si, eliminar</Button>
			<Button onClick={() => closeModal(MODAL_TYPES.DELETE)}>Cancelar</Button>
		</div>
	</Modal>
{/if}

<Toaster richColors={true} position="bottom-right" />
