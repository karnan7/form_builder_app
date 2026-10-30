import axios from "axios";

/** Turns any thrown value into a message you can show in a toast. */
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (error.code === "ECONNABORTED")
      return "The request timed out. Please try again.";
    if (!error.response)
      return "Can't reach the server. Check your connection.";
    return error.response.data?.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return fallback;
}
