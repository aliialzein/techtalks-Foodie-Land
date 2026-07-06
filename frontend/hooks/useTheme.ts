"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

// The theme is an *external* value (a saved `foodieland-theme` preference plus
// the OS `prefers-color-scheme`), so `useSyncExternalStore` is the correct fit:
// it subscribes to changes, reads a snapshot on the client, and returns a stable
// server snapshot so hydration stays consistent — without a setState-in-effect.

function getSnapshot(): Theme {
  const saved = localStorage.getItem("foodieland-theme");
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Rendered on the server and during hydration. Defaults to dark to match the
// app background set in globals.css.
function getServerSnapshot(): Theme {
  return "dark";
}

function subscribe(onChange: () => void): () => void {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    mediaQuery.removeEventListener("change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
