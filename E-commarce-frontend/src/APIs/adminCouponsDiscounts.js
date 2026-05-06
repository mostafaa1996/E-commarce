import { authFetch } from "./AuthFetch";

const URL = import.meta.env.VITE_API_URL;

function buildQueryString(query = {}) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry));
      return;
    }

    if (value !== null && value !== undefined && value !== "") {
      params.append(key, value);
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

async function parseResponse(res, errorMessage) {
  if (!res.ok) {
    throw new Error(errorMessage);
  }
  const data = await res.json();
  console.log(data);
  return data;
}

export async function createCouponForCustomer(coupon) {
  const res = await authFetch(`${URL}/admin/coupons-discounts/coupon`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coupon),
  });

  return parseResponse(res, "Failed to create coupon");
}

export async function deleteCouponForCustomer(couponId) {
  const res = await authFetch(`${URL}/admin/coupons-discounts/coupon/${couponId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return parseResponse(res, "Failed to delete coupon");
}

export async function updateCouponForCustomer(couponId, coupon) {
  const res = await authFetch(`${URL}/admin/coupons-discounts/coupon/${couponId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coupon),
  });

  return parseResponse(res, "Failed to update coupon");
}

export async function getCouponsAndDiscounts(query) {
  const queryString = buildQueryString(query);
  const res = await authFetch(`${URL}/admin/coupons-discounts${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return parseResponse(res, "Failed to fetch coupons and discounts");
}

export async function createDiscountForProduct(discount) {
  const res = await authFetch(`${URL}/admin/coupons-discounts/discount`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(discount),
  });

  return parseResponse(res, "Failed to create discount");
}

export async function deleteDiscountForProduct(discountId) {
  const res = await authFetch(`${URL}/admin/coupons-discounts/discount/${discountId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return parseResponse(res, "Failed to delete discount");
}

export async function updateDiscountForProduct(discountId, discount) {
  const res = await authFetch(`${URL}/admin/coupons-discounts/discount/${discountId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(discount),
  });

  return parseResponse(res, "Failed to update discount");
}
