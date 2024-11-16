import { useEffect, useState } from "react";
export const useWindowScroll = () => {
  const [isScroll, setIsScroll] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { isScroll };
};
