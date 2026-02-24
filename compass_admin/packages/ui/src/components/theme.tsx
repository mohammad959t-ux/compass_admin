"use client";

import * as React from "react";
import { Laptop, Moon, Sun } from "lucide-react";

export type ThemeMode = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "compass-theme";

function getSystemTheme() {
  if (typeof window === "undefined") {
    return "light" as const;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: ThemeMode) {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }
  return resolved;
}

export function ThemeProvider({
  children,
  defaultTheme = "system"
}: {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
}) {
  const [theme, setThemeState] = React.useState<ThemeMode>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const initialTheme = stored ?? defaultTheme;
    setThemeState(initialTheme);
    setResolvedTheme(applyTheme(initialTheme));
  }, [defaultTheme]);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        setResolvedTheme(applyTheme(theme));
      }
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = React.useCallback((next: ThemeMode) => {
    setThemeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    setResolvedTheme(applyTheme(next));
  }, []);

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

type ThemeToggleLabels = {
  label?: string;
  light?: string;
  dark?: string;
  system?: string;
};

type ThemeToggleProps = {
  labels?: ThemeToggleLabels;
  align?: "left" | "right";
};

export function ThemeToggle({ labels, align = "right" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const detailsRef = React.useRef<HTMLDetailsElement>(null);

  const copy = {
    label: labels?.label ?? "Theme",
    light: labels?.light ?? "Light",
    dark: labels?.dark ?? "Dark",
    system: labels?.system ?? "System"
  };

  const modes = [
    { value: "light" as ThemeMode, label: copy.light, icon: Sun },
    { value: "dark" as ThemeMode, label: copy.dark, icon: Moon },
    { value: "system" as ThemeMode, label: copy.system, icon: Laptop }
  ];
  const active = modes.find((mode) => mode.value === theme) ?? modes[2];
  const ActiveIcon = active.icon;

  const handleSelect = (mode: ThemeMode) => {
    setTheme(mode);
    if (detailsRef.current) {
      detailsRef.current.removeAttribute("open");
    }
  };

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const details = detailsRef.current;
      if (!details || !details.hasAttribute("open")) return;
      if (event.target instanceof Node && details.contains(event.target)) return;
      details.removeAttribute("open");
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const details = detailsRef.current;
      if (!details || !details.hasAttribute("open")) return;
      details.removeAttribute("open");
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <details ref={detailsRef} className="relative">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="sr-only">{copy.label}</span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-text/70 transition hover:text-text">
          <ActiveIcon size={18} />
        </span>
      </summary>
      <div
        className={`absolute z-30 mt-2 w-40 rounded-xl border border-border bg-card p-2 text-sm shadow-card ${
          align === "left" ? "left-0" : "right-0"
        }`}
      >
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.value}
              type="button"
              onClick={() => handleSelect(mode.value)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 transition ${
                theme === mode.value
                  ? "bg-muted text-text"
                  : "text-text/70 hover:bg-muted hover:text-text"
              }`}
            >
              <Icon size={16} />
              {mode.label}
            </button>
          );
        })}
      </div>
    </details>
  );
}
