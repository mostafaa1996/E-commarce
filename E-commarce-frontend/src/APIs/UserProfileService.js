import { authFetch } from "./AuthFetch";
import { queryClient } from "../queryClient";

const URL = import.meta.env.VITE_API_URL;

// get user contact details
// get user order history
// get user wishlist
// get user addresses
export async function getUserProfileData() {
  const res = await authFetch(`${URL}/user/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch user profile data");
  }
  const data = await res.json();
  return data;
}

export async function getPersonalInfo() {
  const res = await authFetch(`${URL}/user/profile/personalInfo`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch user personal data");
  }
  const data = await res.json();
  // console.log(data);
  return data;
}

export async function UploadProfileImage(formData) {
  const res = await authFetch(
    `${URL}/user/profile/uploadProfilePic`,
    {
      method: "POST",
      body: formData,
    },
  );
  if (!res.ok) {
    throw new Error("Failed to upload user Image");
  }
  const data = await res.json();
  return data;
}

export async function UpdatePersonalInfo(request) {
  const formData = await request.formData();
  const personalInfo = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    location: formData.get("location"),
    Bio: formData.get("bio"),
  };
  console.log(personalInfo);
  const res = await authFetch(
    `${URL}/user/profile/updatePersonalInfo`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(personalInfo),
    },
  );
  if (!res.ok) {
    throw new Error("Failed to update user personal info");
  }
  const data = await res.json();
  // console.log(data);
  return data;
}

export async function getUserPaginatedOrders(page, limit) {
  console.log(
    `${URL}/user/profile/orders?page=${page}&limit=${limit}`,
  );
  const res = await authFetch(
    `${URL}/user/profile/orders?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!res.ok) {
    throw new Error("Failed to fetch user orders");
  }
  const data = await res.json();
  // console.log(data);
  return data;
}

export async function updateUserWishlist(arrOfIds) {
  console.log(`${URL}/user/profile/UpdateWishlist`, arrOfIds);
  const res = await authFetch(`${URL}/user/profile/UpdateWishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ arrOfIds }),
  });
  if (!res.ok) {
    throw new Error("Failed to update user wishlist");
  }
  const data = await res.json();
  // console.log(data);
  return data;
}

export async function getUserWishlist() {
  console.log(`${URL}/user/profile/GetWishlist`);
  const res = await authFetch(`${URL}/user/profile/GetWishlist`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch user wishlist");
  }
  const data = await res.json();
  // console.log(data);
  return data;
}

export async function getUserAddresses() {
  const res = await authFetch(`${URL}/user/profile/addresses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch user addresses");
  }
  const data = await res.json();
  // console.log(data);
  return data;
}

export async function updateUserAddresses(request) {
  const formData = await request.formData();
  const address = {
    label: formData?.get("label"),
    name: formData?.get("name"),
    phone: formData?.get("phone"),
    email: formData?.get("email"),
    street: formData?.get("street"),
    city: formData?.get("city")?.split(",")[0],
    state: formData?.get("city")?.split(",")[1],
    country: formData?.get("country"),
    zipCode: formData?.get("zip"),
  };
  const intent = formData.get("intent");
  const id = formData.get("id");
  // console.log(address, intent);
  let res = null;
  switch (intent) {
    case "Add":
      res = await authFetch(`${URL}/user/profile/updateAddress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      });
      if (!res.ok) {
        throw new Error("Failed to add user address");
      }
      break;
    case "Save":
      res = await authFetch(
        `${URL}/user/profile/updateAddress/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(address),
        },
      );
      if (!res.ok) {
        throw new Error("Failed to update user address");
      }
      break;
    case "delete":
      res = await authFetch(
        `${URL}/user/profile/deleteAddress/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!res.ok) {
        throw new Error("Failed to delete user address");
      }
      break;
    case "setAsDefault":
      res = await authFetch(
        `${URL}/user/profile/SetAddressToDefault/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!res.ok) {
        throw new Error("Failed to set user address as default");
      }
      break;
    default:
      break;
  }
  const data = await res.json();
  // console.log(data);
  await queryClient.invalidateQueries({ queryKey: ["profile-addresses"] });
  await queryClient.refetchQueries({
    queryKey: ["profile-addresses"],
    type: "active",
  });
  return data;
}

export async function getUserPaymentMethods() {
  const res = await authFetch(
    `${URL}/user/profile/getPaymentMethods`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
  if (!res.ok) {
    throw new Error("Failed to fetch user payment methods");
  }
  const data = await res.json();
  const {cards} = data;
  // console.log(data);
  return cards;
}

export async function SetUpPaymentMethods() {
  const res = await authFetch(
    `${URL}/user/profile/setUpPaymentMethods`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
  if (!res.ok) {
    throw new Error("Failed to set up payment methods");
  }
  const data = await res.json();
  // console.log(data);
  return data;
}

export async function setCardAsDefault(id) {
  const res = await authFetch(
    `${URL}/user/profile/setDefaultPaymentMethod/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
  if (!res.ok) {
    throw new Error("Failed to set card as default");
  }
  const data = await res.json();
  // console.log(data);
  return data;
}

export async function deletePaymentMethod(id){
  const res = await authFetch(
    `${URL}/user/profile/deletePaymentMethod/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
  if (!res.ok) {
    throw new Error("Failed to delete payment method");
  }
  const data = await res.json();
  // console.log(data);
  return data;
}

export async function changePassword(request){
  const formData = await request.formData();
  const newPassword = formData.get("newPassword");
  const currentPassword = formData.get("currentPassword");
  const confirmPassword = formData.get("confirmPassword");
  if (newPassword !== confirmPassword) return {message: "Passwords do not match" , ok: false};
  const res = await authFetch(
    `${URL}/user/profile/changePassword`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPassword, currentPassword }),
    },
  )
  if (!res.ok) {
    throw new Error("Failed to change password");
  }
  const data = await res.json();
  console.log(data);
  return data;
}


