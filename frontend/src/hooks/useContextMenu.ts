import { useState, useEffect } from "react";

const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleClick = () => setContextMenu({ visible: false, x: 0, y: 0 });
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return {
    contextMenu,
    setContextMenu,
  };
};

export default useContextMenu;
