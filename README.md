# Task Flow 

A modern, responsive, and highly interactive Task Management Dashboard built with React and TypeScript.

**Live Demo:** [https://task-flow-eight-nu.vercel.app/](https://task-flow-eight-nu.vercel.app/)

##  Features

- **Kanban Board & List View:** Seamlessly toggle between a traditional list view and a 3-column Kanban board (To Do, In Progress, Completed).
- **Drag & Drop Reordering:** Fully accessible drag-and-drop functionality using `@dnd-kit`. Smoothly move tasks between Kanban columns to update their status instantly!
- **Persistent Storage:** Data is automatically saved to your browser's LocalStorage. Your tasks will be waiting for you when you return.
- **Advanced Filtering & Search:** Instantly filter tasks by status, priority, or search by text in the title/description.
- **Dark Mode Support:** Beautifully themed light and dark modes toggleable from the dashboard header.
- **Smooth Animations:** Utilizes `framer-motion` for buttery smooth layout transitions and element rendering.
- **Robust Testing:** Core logic and components are tested using `Vitest` and React Testing Library.

##  Technology Stack

- **Frontend Framework:** React 18 with TypeScript, initialized via Vite.
- **Styling:** Tailwind CSS for rapid, utility-first styling.
- **UI Components:** Shadcn UI (Radix UI + Tailwind) for beautiful, accessible, and customizable base components.
- **Drag and Drop:** `@dnd-kit/core` and `@dnd-kit/sortable` for the Kanban and List reordering.
- **Animations:** `framer-motion` for declarative layout animations.
- **Date Formatting:** `date-fns` for rendering robust due dates and timestamps.
- **Testing:** `Vitest`, `@testing-library/react`, and `jsdom`.

## Design Decisions & Architecture

1.  **State Management (Context + Custom Hook):**
    Instead of using heavy libraries like Redux, we opted for React's native Context API combined with a custom `useTaskManager` hook. The logic for filtering, sorting, and stats calculation lives entirely in the hook, keeping the components clean. The Context simply acts as a dependency injector to avoid prop-drilling.
2.  **Modular Component Design:**
    The monolith `Dashboard.tsx` was broken down into singular responsibilities across `TaskListContainer`, `DashboardStats`, `DashboardFilters`, etc. This allows for easier testing and future scalability.
3.  **Kanban `DragOverlay` vs Motion Layout:**
    When implementing the Kanban drag-and-drop, we found an inherent CSS conflict between Framer Motion's automatic layout animations and dnd-kit's positional transforms. To resolve this, we isolated the drag node and implemented a `DragOverlay`. This guarantees that moving cards across columns is visually flawless without any "jumping" layout bugs.
4.  **Local Storage Persistence:**
    We created a custom generic `useLocalStorage` hook that intercepts JSON parsing to safely revive Date objects that define task deadlines and creation times.

##  Local Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/aditya22314/Task-Flow.git
    cd Task-Flow
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**

    ```bash
    npm run dev
    ```

4.  **Run the unit tests:**
    ```bash
    npm run test
    ```

The application will be available at `http://localhost:5173`.
