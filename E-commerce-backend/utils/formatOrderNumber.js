exports.formatOrderId = function(order) {
  const date = new Date(order.createdAt || order.date || Date.now())
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const suffix = String(order._id).slice(-6).toUpperCase();

  return `#ORD-${date}-${suffix}`;
}