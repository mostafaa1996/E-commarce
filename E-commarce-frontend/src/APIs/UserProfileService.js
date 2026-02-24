import { authFetch } from "./AuthFetch";

const DevelopmentURL = "http://localhost:3000";
// get user contact details
// get user order history
// get user wishlist
// get user addresses
export async function getUserProfileData() {
  const res = await authFetch(`${DevelopmentURL}/user/profile` , 
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
  );
  if(!res.ok) {
    throw new Error("Failed to fetch user profile data");
  }
  const data = await res.json();
  return data;  
}

export async function getPersonalInfo() {
  const res = await authFetch(`${DevelopmentURL}/user/profile/personalInfo` , 
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
  );
  if(!res.ok) {
    throw new Error("Failed to fetch user personal data");
  }
  const data = await res.json();
  return data;
}

export async function UploadProfileImage(formData){
  const res = await authFetch(`${DevelopmentURL}/user/profile/uploadProfilePic` , 
  {
    method: "POST",
    body: formData
  }
  );
  if(!res.ok) {
    throw new Error("Failed to upload user Image");
  }
  const data = await res.json();
  return data;
}

export async function UpdatePersonalInfo(request){
  const formData = await request.formData();
  const personalInfo = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    location: formData.get("location"),
    Bio : formData.get("bio")
  }
  console.log(personalInfo);
  const res = await authFetch(`${DevelopmentURL}/user/profile/updatePersonalInfo` , 
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(personalInfo),
  }
  );
  if(!res.ok) {
    throw new Error("Failed to update user personal info");
  }
  const data = await res.json();
  console.log(data);
  return data;
}