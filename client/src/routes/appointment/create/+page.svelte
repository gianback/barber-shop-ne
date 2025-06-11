<script lang="ts">
	import { DatePicker } from '@svelte-plugins/datepicker';
	import { format } from 'date-fns';
	import Layout from '../../+layout.svelte';
	import Header from '$lib/components/Header.svelte';
	import Button from '$lib/components/Button.svelte';

	let { data, form } = $props();

	const { services } = data;

	let dateFormat = 'MM/dd/yy';

	const formatDate = (dateString: Date) => {
		if (isNaN(new Date(dateString).getTime())) {
			return '';
		}

		return (dateString && format(new Date(dateString), dateFormat)) || '';
	};

	let startDate = $state<Date | undefined>();

	let isOpen = $state(false);
	let timeList = $state<{ hour: string; iso: string }[]>([]);

	let timeSelected = $state<string>('');
	let serviceSelected = $state<string>('');
	const toggleDatePicker = () => (isOpen = !isOpen);

	let formattedStartDate = $derived(formatDate(startDate!));

	const getTimes = async (data: string) => {
		const response = await fetch(`http://localhost:3000/appointments/date/${data}`);

		const times = await response.json();

		timeList = times;
	};

	$effect(() => {
		if (startDate) {
			const ios = new Date(startDate!).toISOString();
			getTimes(ios);
		}
	});
</script>

<Layout>
	<Header />

	<main class="bg-white/85">
		<div class="mx-auto max-w-3xl py-16">
			<h1 class="text-center text-4xl font-bold text-primary">Agendar cita</h1>
			<p class="my-4 text-center font-medium">
				Hora de atención: Lunes a Viernes de 9:00 a 18:00 horas
			</p>
			<form
				method="POST"
				action="?/create"
				class="mt-8 w-full space-y-6 rounded-lg bg-tertiary p-12"
			>
				<div class="space-y-4">
					<p class="text-lg leading-none text-white">Selecciona una servicio</p>
					<div class="grid grid-cols-3">
						{#each services as service}
							<label
								for={service.id}
								class="flex justify-start gap-4 rounded-md border-2 border-solid px-2 text-center text-lg text-white transition-all duration-300 ease-out {service.id ===
								serviceSelected
									? 'border-secondary'
									: 'border-transparent'}"
							>
								<input
									type="radio"
									name="service"
									id={service.id}
									required
									class="bg-white accent-secondary"
									bind:group={serviceSelected}
									value={service.id}
									checked={service.id === serviceSelected}
								/>
								{service.name}
							</label>
						{/each}
					</div>
				</div>
				<div class="space-y-4">
					<label for="date" class="text-lg leading-none text-white">Selecciona una fecha</label>
					<DatePicker
						id="date"
						enablePastDates={false}
						disabledDates={[formatDate(new Date())]}
						enableFutureDates={true}
						startOfWeek="1"
						bind:isOpen
						bind:startDate
					>
						<input
							class="w-full text-lg"
							type="text"
							name="date"
							placeholder="Fecha"
							autocomplete="off"
							value={formattedStartDate}
							onclick={toggleDatePicker}
						/>
					</DatePicker>
				</div>
				{#if timeList.length > 0}
					<div class="space-y-4">
						<p class="text-lg text-white">Hora</p>
						<div class="grid grid-cols-2">
							{#each timeList as time}
								<label
									for={time.hour}
									class="flex justify-center gap-4 rounded-md border-2 border-solid text-center text-lg text-white transition-all duration-300 ease-out {time.iso ===
									timeSelected
										? 'border-secondary'
										: 'border-transparent'}"
								>
									<input
										type="radio"
										name="time"
										id={time.hour}
										class="bg-white accent-secondary"
										bind:group={timeSelected}
										value={time.iso}
										checked={time.iso === timeSelected}
									/>
									{time.hour}:00
								</label>
							{/each}
						</div>
					</div>
					<Button type="submit" className="w-full">Agendar</Button>
				{/if}
			</form>
			{#if form?.success}
				<p class="font-med my-4 text-center text-lg text-green-500">Su cita ha sido reservada</p>
			{:else}
				<p>
					{form?.message}
				</p>
			{/if}
		</div>
	</main>
</Layout>

<style>
	input[type='text'] {
		border: 1px solid #e8e9ea;
		border-radius: 4px;
		padding: 8px;
	}
</style>
