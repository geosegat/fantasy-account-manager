import React from "react";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export const AppToaster = () => {
  const { theme: rawTheme = "system" } = useTheme();
  const theme = rawTheme as "system" | "light" | "dark";

  return <Toaster />;
};
