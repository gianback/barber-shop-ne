export const formatPrice = (price: number) => {
	return new Intl.NumberFormat('es-PE', {
		currency: 'PEN',
		style: 'currency',
		currencyDisplay: 'symbol',
		maximumFractionDigits: 2
	}).format(price);
};
