const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
    style: 'currency', currency: 'usd', minimumFractionDigits: 2, maximumFractionDigits: 2
})
export function formatCurrency(number: number) {
    return (
        number === undefined || number === null ? '' : CURRENCY_FORMATTER.format(number)
    )
}