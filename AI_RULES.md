# AI Development Rules

This document outlines the rules and conventions for AI-driven development of this web application. Following these guidelines ensures consistency, maintainability, and adherence to the project's architecture.

## Tech Stack

This project is built with a modern, component-based architecture. The key technologies are:

-   **Framework**: React with Vite for a fast development experience.
-   **Language**: TypeScript for type safety and improved developer experience.
-   **Styling**: Tailwind CSS for all styling. Utility-first classes are the standard.
-   **UI Components**: `shadcn/ui` is the primary component library. These are unstyled, accessible components that can be customized with Tailwind CSS.
-   **Routing**: React Router (`react-router-dom`) is used for all client-side routing.
-   **Data Fetching & State**: TanStack Query (`@tanstack/react-query`) is used for managing server state, including caching, refetching, and mutations.
-   **Forms**: React Hook Form (`react-hook-form`) combined with Zod for schema-based validation is the standard for building forms.
-   **Icons**: `lucide-react` provides a comprehensive set of icons.

## Library Usage Rules

To maintain a clean and consistent codebase, please adhere to the following rules:

1.  **Styling**:
    -   **ALWAYS** use Tailwind CSS utility classes for styling.
    -   **DO NOT** write custom CSS in `.css` files, except for global base styles in `src/index.css`.
    -   **DO NOT** use CSS-in-JS libraries (e.g., styled-components, Emotion).

2.  **Component Library**:
    -   **ALWAYS** prefer using a component from `shadcn/ui` if one exists for the required purpose. These are located in `src/components/ui`.
    -   **DO NOT** modify the `shadcn/ui` components directly. If customization is needed beyond what props allow, create a new component that wraps the `shadcn/ui` component.
    -   **ALWAYS** create new, reusable components in the `src/components` directory.

3.  **Routing**:
    -   All application routes **MUST** be defined in `src/App.tsx` within the `<Routes>` component.
    -   Each route should correspond to a page component located in `src/pages`.

4.  **State Management**:
    -   For **server state** (data fetched from an API), **ALWAYS** use TanStack Query.
    -   For **client state** (UI state, form data, etc.), use React's built-in hooks (`useState`, `useReducer`, `useContext`).
    -   **DO NOT** introduce other state management libraries like Redux or MobX without explicit instruction.

5.  **Forms**:
    -   **ALWAYS** use `react-hook-form` for managing form state and submissions.
    -   **ALWAYS** use `zod` to define validation schemas for forms.
    -   Integrate `react-hook-form` with `shadcn/ui` form components.

6.  **Icons**:
    -   **ONLY** use icons from the `lucide-react` library. This ensures visual consistency.

7.  **File Structure**:
    -   **Pages**: Place all top-level page components in `src/pages`.
    -   **Components**: Place all reusable, custom components in `src/components`.
    -   **Hooks**: Custom hooks should be placed in `src/hooks`.
    -   **Utilities**: General utility functions should be placed in `src/lib`.

By following these rules, we can ensure the AI generates code that is consistent, predictable, and easy to maintain.