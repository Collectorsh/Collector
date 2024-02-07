import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import * as Icon from 'react-feather'
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
        <Icon.Sun
          size={26}
          color="yellow"
          // className="text-yellow-300 inline pr-0.5 pt-0.5"
          role="button"
          strokeWidth={2.5}
        />
      );
    } else {
      return (
        <Icon.Moon
          size={26}
          color="gray"
          role="button"
          strokeWidth={2.5}
        />
      );
    }
  };

  return <div className="inline-flex items-center gap-1" onClick={handleClick}>
    {renderThemeChanger()}
    {withText ? <span className="ml-1">Toggle Dark Mode</span>: null}
  </div>;
};

export default DarkMode;
