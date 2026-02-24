const STORAGE_KEY = "compass-theme";

export function ThemeScript() {
  const script = `(() => {\n  try {\n    const stored = localStorage.getItem(\"${STORAGE_KEY}\") || \"system\";\n    const systemDark = window.matchMedia(\"(prefers-color-scheme: dark)\").matches;\n    const resolved = stored === \"system\" ? (systemDark ? \"dark\" : \"light\") : stored;\n    document.documentElement.classList.toggle(\"dark\", resolved === \"dark\");\n  } catch (e) {}\n})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
