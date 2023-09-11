import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/solid";
import { useState, useEffect } from "react";

const DarkMode = ({withText}) => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => { 
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }

  const renderThemeChanger = () => {
    if (!mounted) return null;

    const currentTheme = theme === "system" ? systemTheme : theme;

    if (currentTheme === "dark") {
      return (
        <SunIcon
          className="w-7 h-7 text-yellow-500 inline pr-0.5 pt-0.5"
          role="button"
        
        />
      );
    } else {
      return (
        <MoonIcon
          className="w-7 h-7 text-gray-900 inline hover:scale-110 pr-0.5 pt-0.5"
          role="button"
         
        />
      );
    }
  };

  return <div className="inline" onClick={handleClick}>
    {renderThemeChanger()}
    {withText ? <span className="ml-1">Toggle Dark Mode</span>: null}
  </div>;
};

export default DarkMode;
