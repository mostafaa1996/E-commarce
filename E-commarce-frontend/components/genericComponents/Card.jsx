import { useNavigate } from "react-router-dom";
export default function Card({ children, className = "" , NavigationLink}) {
  const navigate = useNavigate();
  function handleClick() {
    navigate(NavigationLink);
  } 
  return (
    <div
      className={`
        bg-white
        border border-zinc-200
        rounded-xl
        overflow-hidden
        hover:shadow-lg
        hover:scale-110
        hover:border-[#FF6543]
        active:scale-100
        transition
        cursor-pointer
        ${className}
      `}
      role="button"
      onClick={handleClick}     
    >
      {children}
    </div>
  );
}
