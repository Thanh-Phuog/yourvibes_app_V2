"use client"
import { useEffect, useState } from "react";
import { useAuth } from "../context/auth/useAuth";

export const Color = {
  black: "#000000",
  white: "#ffffff",
  darkGray: "#494949",
  lightGray: "#E2E2E2",
  veryLightGray: "#F6F6F6",
  lightPink: "#FFCCFF",
  limeGreen: "#32CD32",
  charcoalBlue: "#30333A",
  gunmetal: "#202427",
  steelGray: "#62676B",
  darkSlate:"#31343B",
  lightSteelBlue: "#354E6C",
  lightBlue: "#DDEFFF",
}


const useColor = () => {
  const { theme } = useAuth();
  const [backGround, setBackground] = useState(Color.veryLightGray);
  const [brandPrimary, setBrandPrimary] = useState(Color.black);
  const [brandPrimaryTap, setBrandPrimaryTap] = useState(Color.darkGray);
  const [backgroundColor, setBackgroundColor] = useState(Color.white);
  const [menuItem, setMenuItem] = useState(Color.white);
  const lightGray = "#E2E2E2"
  const darkGray = Color.darkGray
  const borderBirth = Color.lightPink
  const colorOnl = Color.limeGreen
  const [borderColor, setBorderColor] = useState(Color.lightGray);
  const darkSlate = Color.darkSlate
  const [colorChat, setColorChat] = useState(Color.lightBlue);



  useEffect(() => {
    if (theme === "dark") {
      setBrandPrimary(Color.white);
      setBrandPrimaryTap(Color.lightGray);
      setBackgroundColor(Color.gunmetal);
      setBackground(Color.charcoalBlue);
      setMenuItem(Color.steelGray);
      setBorderColor(Color.steelGray);
      setColorChat(Color.lightSteelBlue);
    } else { // light
      setBrandPrimary(Color.black);
      setBrandPrimaryTap(Color.darkGray);
      setBackgroundColor(Color.white);
      setBackground(Color.veryLightGray);
      setMenuItem(Color.white);
      setBorderColor(Color.lightGray);
      setColorChat(Color.lightBlue);
    }
  }
  , [theme]);

  return {
    theme,
    brandPrimary,
    brandPrimaryTap,
    backgroundColor,
    lightGray,
    borderBirth,
    colorOnl,
    backGround,
    borderColor,
    menuItem,
    darkSlate,
    darkGray,
    colorChat,
  }
}

export default useColor