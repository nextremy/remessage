export function getButtonClassName(variant: "primary" | "text") {
  if (variant === "primary") {
    const className =
      "rounded bg-blue-700 text-lg font-bold text-gray-50 enabled:hover:bg-blue-600 disabled:opacity-50";
    return className;
  }
  const className =
    "flex items-center gap-2 rounded px-4 font-semibold text-gray-700 hover:bg-gray-200";
  return className;
}
