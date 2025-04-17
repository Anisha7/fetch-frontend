// src/store/favoritesStore.ts

/**
 * We are using `localStorage` instead of Redux because this is a simple use case
 * where we just need to persist a list of favorite dog IDs across sessions.
 * There's no need for global state management or complex UI interactions here.
 * 
 * Redux (or similar state management) is beneficial in more complex scenarios—
 * like syncing favorites across components in real-time, combining it with user login state,
 * or syncing with a backend. For this use case, `localStorage` is lightweight and sufficient.
 */

const STORAGE_KEY = "favoriteDogIds";

/**
 * Get the list of all favorited dog IDs
 */
export function getFavoriteDogs(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse favorite dogs from localStorage", e);
    return [];
  }
}

/**
 * Add a dog ID to the list of favorites
 */
export function addFavoriteDog(dogId: string): void {
  const favorites = new Set(getFavoriteDogs());
  favorites.add(dogId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favorites)));
}

/**
 * Remove a dog ID from the list of favorites
 */
export function removeFavoriteDog(dogId: string): void {
  const favorites = new Set(getFavoriteDogs());
  favorites.delete(dogId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favorites)));
}