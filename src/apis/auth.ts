import { API_URL } from ".";
import { UserInfo } from "../types";

/**
 * Sends a POST request to the login endpoint with user information.
 * Includes credentials to store the auth cookie on success.
 *
 * @param props - An object containing the user's name and email.
 * @throws Error if the response status is not OK.
 */
export const login = async (props: UserInfo) : Promise<void> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(props),
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Login failed with status: ${response.status}`)
  }
}
  
/**
 * Sends a logout request to the API to invalidate the session cookie.
 * Includes credentials to ensure the cookie is correctly identified and cleared.
 *
 * @returns A promise resolving to the fetch response.
 */
export const logout = async () =>
  await fetch(`${API_URL}/auth/logout`, {
    credentials: "include",
  });

  