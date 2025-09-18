# Smart To-Do — React Frontend (Phase 1)

This is a modern, responsive, and production-ready To-Do application frontend built with React and Tailwind CSS. It is designed to be easily connected to a Django REST Framework backend.

## ✨ Features

-   **Full Task CRUD:** Create, read, update, and delete tasks.
-   **Task Properties:** Includes title, description, due date, and priority (low/medium/high).
-   **Status Management:** Mark tasks as 'pending' or 'completed'.
-   **Filtering & Sorting:** Filter tasks by status and search by title. Sort by creation date, due date, or priority.
-   **Bulk Actions:** Mark all tasks as complete or delete all completed tasks.
-   **Data Persistence:** Uses `localStorage` to save tasks, so your data persists across browser refreshes.
-   **Visual Analytics:** Includes charts to visualize tasks completed over the last 7 days and daily progress.
-   **Browser Notifications:** Asks for permission to show reminders for upcoming tasks.
-   **Mock Authentication:** A placeholder login/signup flow to simulate user accounts.
-   **Responsive Design:** Looks great on both mobile and desktop devices.
-   **Dark/Light Theme:** Includes a theme toggle.

## 💻 Tech Stack

-   **Frontend:** [React](https://reactjs.org/) (with Vite)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [daisyUI](https://daisyui.com/)
-   **Routing:** [React Router](https://reactrouter.com/)
-   **Charting:** [Chart.js](https://www.chartjs.org/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Utilities:** [date-fns](https://date-fns.org/), [uuid](https://github.com/uuidjs/uuid)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (v16 or later) and npm installed.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd smart-todo-react
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

To start the local development server, run:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Building for Production

To create a production-ready build of the app, run:
```bash
npm run build
```
The optimized files will be generated in the `dist/` directory.

## 🏗️ Project Structure

The codebase is organized into the following directories:

```
src/
├── api/          # Mock API calls (interacts with localStorage)
├── components/   # Reusable React components
├── hooks/        # Custom hooks for state management (useTasks, useAuth)
├── pages/        # Top-level page components (Dashboard, Login)
├── utils/        # Helper functions (date formatting, chart calculations)
└── index.css     # Global styles and Tailwind directives
```

## 🔗 Migrating to a Django REST Backend

This project is structured to make the transition from `localStorage` to a real backend seamless. The key is the `src/api/` directory, which abstracts all data operations.

**Here are the steps to connect to your Django API:**

1.  **Install an HTTP client:**
    ```bash
    npm install axios
    ```
2.  **Update API Files:** Go into `src/api/tasksAPI.js` and `src/api/authAPI.js`.
3.  **Replace Logic:** Replace the `localStorage` logic inside each function with an `axios` call to your Django endpoints.

**Example: Updating `getTasks` in `src/api/tasksAPI.js`**

```javascript
// Before
export const getTasks = async (userId) => {
  const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const userTasks = allTasks.filter(task => task.user === userId);
  return Promise.resolve(userTasks);
};

// After (with Axios and JWT)
import axios from 'axios';

// You would configure axios to send the auth token with each request
// See Axios interceptors for a clean way to do this.

export const getTasks = async () => {
  const response = await axios.get('/api/tasks/');
  return response.data;
};
```
Because all the functions in the `api` directory already return Promises, you won't need to make any significant changes to your hooks (`useTasks`, `useAuth`) or components.

## ✅ Django REST Compatibility Checklist

### Example Task Model
Your Django `Task` model should look something like this:

```python
# models.py
from django.db import models
from django.conf import settings

class Task(models.Model):
    class Priority(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'
    
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        COMPLETED = 'completed', 'Completed'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateTimeField(blank=True, null=True)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
```

### Example API Endpoints & Payloads

-   `GET /api/tasks/`: Returns a list of tasks for the authenticated user.
    ```json
    [{ "id": 1, "title": "...", "user": 1, ... }]
    ```
-   `POST /api/tasks/`: Creates a new task.
    -   **Body:** `{ "title": "New Task", "description": "...", "priority": "high" }`
-   `PUT /api/tasks/:id/`: Updates an existing task.
    -   **Body:** `{ "title": "Updated Title", "status": "completed" }`
-   `DELETE /api/tasks/:id/`: Deletes a task.
-   `POST /api/auth/login/`: Authenticates a user and returns JWT tokens.
    -   **Returns:** `{ "access": "<jwt>", "refresh": "<jwt>" }`