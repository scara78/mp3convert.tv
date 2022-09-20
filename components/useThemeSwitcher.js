import { useState, useEffect } from "react";

const useThemeSwitcher = () => {
  const [theme, setTheme] = useState(null);

  const togglerStyles = {
    position: "fixed",
    zIndex: 100,
    bottom: "1em",
    right: "1em",
    color: "#fff",
    border: `2px solid ${theme === "dark" ? "#fff" : "#000"}`,
    padding: "4px",
    background: "transparent",
    cursor: "pointer",
    borderRadius: "5px",
    width: "30px",
    height: "30px",
  };

  useEffect(() => {
    if (localStorage.getItem("theme") === "light") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <button
      style={togglerStyles}
      onClick={() => setTheme((theme) => (theme === "dark" ? "light" : "dark"))}
    >
      <svg
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 496 496"
      >
        <path
          fill={theme === "dark" ? "#fff" : "#000"}
          d="M8,256C8,393,119,504,256,504S504,393,504,256,393,8,256,8,8,119,8,256ZM256,440V72a184,184,0,0,1,0,368Z"
          transform="translate(-8 -8)"
        />
      </svg>
    </button>
  );
};

export default useThemeSwitcher;
