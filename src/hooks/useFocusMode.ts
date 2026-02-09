import { useState } from "react";

export function useFocusMode() {
  const [isFocusMode, setIsFocusMode] = useState(false);

  const toggleFocusMode = () => {
    setIsFocusMode((prev) => !prev);
  };

  return {
    isFocusMode,
    toggleFocusMode,
  };
}