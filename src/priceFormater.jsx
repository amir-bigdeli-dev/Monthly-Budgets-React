const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

function formatPrice(price) {
  return intl.format(price);
}

export default formatPrice;
