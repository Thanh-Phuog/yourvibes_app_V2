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
  charcoalBlue: "#262930",
  gunmetal: "#202427",
  steelGray: "#62676B",
  darkSlate:"#31343B"
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
  const borderColor = Color.steelGray
  const darkSlate = Color.darkSlate



  useEffect(() => {
    if (theme === "dark") {
      setBrandPrimary(Color.white);
      setBrandPrimaryTap(Color.lightGray);
      setBackgroundColor(Color.gunmetal);
      setBackground(Color.charcoalBlue);
      setMenuItem(Color.steelGray);
    } else { // light
      setBrandPrimary(Color.black);
      setBrandPrimaryTap(Color.darkGray);
      setBackgroundColor(Color.white);
      setBackground(Color.veryLightGray);
      setMenuItem(Color.white);
    }
  }
  , [theme]);

  return {
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
    darkGray
  }
}

export default useColor