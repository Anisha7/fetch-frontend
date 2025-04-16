import { API_URL } from ".";
import { UserInfo } from "../types";

// TODO: Add function header comments

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
  

export const logout = async () =>
  await fetch(`${API_URL}/auth/logout`, {
    credentials: "include",
  });

  