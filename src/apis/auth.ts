import { UserInfo } from "../types";

const API_URL = "https://frontend-take-home-service.fetch.com";

// TODO: Add function header comments

export const login = async (props: UserInfo) : Promise<void> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(props),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Login failed with status: ${response.status}`)
  }
}
  

export const logout = async (props: UserInfo) =>
  await fetch(`${API_URL}/auth/logout`, {
    credentials: "include",
  });

  