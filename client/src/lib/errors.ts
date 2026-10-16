import axios from "axios";

/** Turns any thrown error into a message you can show in a toast. */
export function getApiErrorMessage(
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
  return error instanceof Error ? error.message : fallback;
}
