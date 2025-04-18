# 🐶 Fetch Frontend Take Home – Anisha Jain

**Live Demo:** [https://anisha7.github.io/fetch-frontend/](https://anisha7.github.io/fetch-frontend/)

This project is my solution to the [Fetch Frontend Take Home Assignment](https://frontend-take-home.fetch.com/), a full-stack React application that allows users to authenticate, search for adoptable dogs, filter and paginate results, favorite dogs, and receive a perfect match—all powered by Fetch's APIs.

---

## ✨ Features Implemented

### ✅ Authentication

- Login via Name & Email
- Auth cookie handled securely using `credentials: include`
- Pure CSS Dog Animation

### 🐕 Dog Search Page

- Search and display adoptable dogs
- Filter by **breed**, **zip code**, and **age range**
- **Pagination** of results
- **Sorting** by breed (ascending/descending)
- Display all dog fields (except ID) with clean UI
- Add/Remove **Favorites** with heart icon
- View dog locations on **interactive Google Map**
- Click marker to view dog details

### ❤️ Favorites Page

- View all dogs added to favorites
- Easily revisit favorites across sessions (via localStorage)

### 🎯 Matching Feature

- Generate a match based on favorited dogs
- Matched dog shown in a modal with complete details

---

## 🔮 Future Improvements (If I Had More Time)

If I had more time, I would refactor state management using the React Context API along with useReducer for better structure and scalability.
	•	I’d create separate contexts for key state domains:
	•	AuthContext for managing login/authentication state
	•	FavoritesContext to replace the current localStorage approach
	•	SearchContext to handle filters and search results
	•	I’d use useReducer in each context to ensure predictable state transitions, and wrap the app with these providers so components can access global state using custom hooks like useAuth(), useFavorites(), and useSearch().

This approach would simplify prop management and scale well with future features.

I would also add unit tests for all the files using React Testing Libary.

---
## 🛠️ Tech Stack

- **React** + **TypeScript**
- **Material UI (MUI)** for styling
- **React Router** for routing
- **Google Maps API** (`@react-google-maps/api`)
- **LocalStorage** for client-side favorites persistence
- **Fetch API** with `credentials: 'include'` for secure cookie-based auth

---

## 📁 Folder Structure Highlights

```bash
src/
├── apis/              // API helper functions
├── components/        // Reusable UI components (e.g. DogCard, Map)
├── pages/             // Auth, Search, Favorites pages
├── store/             // LocalStorage utility for favorites
├── types/             // Shared TypeScript types
└── styles/            // Shared styled components
```

---

## 🦪 Available Scripts

In the project directory, run:

### `npm start`

Runs the app in development mode at [http://localhost:3000/fetch-frontend/](http://localhost:3000/fetch-frontend/)

### `npm test`

Launches the test runner (Jest) in watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run deploy`

Deploys the app to **GitHub Pages** using the `gh-pages` branch. Requires `homepage` field in `package.json` to be configured.

---

## 🧠 Learnings & Extras

- Implemented debounce handling for map bounds updates
- Styled using both **MUI** and **styled-components** approach for flexibility
- Followed React and TypeScript best practices with reusable components and hooks
- Added accessibility-friendly UI enhancements (keyboard tabbing, labels)

---

## 📦 Deployment

This app is deployed via **GitHub Pages** using a custom `homepage` config in `package.json`.

---

## 🐾 Credits

Thanks to Fetch for the fun and thoughtful assignment.  
Built with care by **Anisha Jain** ✨
