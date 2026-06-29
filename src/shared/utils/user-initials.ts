/** First + last initial from display name, else email prefix. */
export function getUserInitials(
  name: string | null | undefined,
  email: string | null | undefined,
): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
    }
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  if (email) {
    const local = email.split("@")[0] ?? "";
    if (local.length >= 2) return local.slice(0, 2).toUpperCase();
    return local.slice(0, 1).toUpperCase() || "AW";
  }
  return "AW";
}
