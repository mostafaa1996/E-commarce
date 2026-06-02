import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export const useScrollTo = () => {
      const location = useLocation();
    
      useEffect(() => {
        let timeout;
        if (location.hash) {
          const element = document.querySelector(location.hash);
          if (element) {
            timeout = setTimeout(() => {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
          }
        }
        return () => clearTimeout(timeout);
      }, [location.hash]);
};