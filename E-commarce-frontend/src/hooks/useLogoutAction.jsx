import { useNavigate } from "react-router-dom";
import { logoutAction } from "@/APIs/AuthService";


export default function useLogoutAction(){
  const navigate = useNavigate();
  async function Logout(){
    await logoutAction();
    navigate("/login");
  }
  return {Logout};
}