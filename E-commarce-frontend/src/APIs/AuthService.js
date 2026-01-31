import { redirect } from "react-router-dom";
const DevelopmentURL = "http://localhost:3000";
export async function loginAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email) return "Please enter your email";
  if (!password) return "password is required";

  try {
    const res = await fetch(`${DevelopmentURL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      return "Invalid email or password";
    }

    const data = await res.json();

    // store token
    localStorage.setItem("access-token", data.accessToken);
    localStorage.setItem("refresh-token", data.refreshToken);

    // redirect after success
    return redirect("/shop");
  } catch (error) {
    console.error(error);
    return "Something went wrong, try again";
  }
}

export async function SignupAction({ request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  console.log(name, email, password, confirmPassword);
  if (!email) return "Please enter your email";
  if (!password) return "password is required";
  if (password !== confirmPassword) return "Passwords do not match";

  try {
    const res = await fetch(`${DevelopmentURL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      return "Invalid email or password";
    }

    // redirect after success
    return redirect("/login");
  } catch (error) {
    console.error(error);
    return "Something went wrong, try again";
  }
}
