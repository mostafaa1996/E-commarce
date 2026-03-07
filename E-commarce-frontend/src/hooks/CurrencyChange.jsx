function useCurrency(currency, locale) {
  return (price) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(price);
}

export default useCurrency;
