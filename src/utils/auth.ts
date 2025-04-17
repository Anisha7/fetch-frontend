import { removeFavorites } from "../store/favoritesStore";
import { logout } from "../apis/auth";
import { NavigateFunction } from "react-router-dom";

/**
 * Logs the user out, clears favorites, and navigates to the login page.
 * Can be reused across components like LogoutButton and ProtectedRoute.
 */
export const handleLogoutAndRedirect = async (navigate: NavigateFunction) => {
  try {
    await logout(); // optional in some flows
  } catch {}
  removeFavorites();
  navigate("/", { replace: true });
};