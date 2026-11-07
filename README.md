# FitFetch

FitFetch is a full-stack fitness application for creating personalised workout
and nutrition plans. Users can register and sign in with Firebase, generate
plans based on their profile, save or remove plans, browse exercises and foods,
manage their profile, and export plans as PDFs. Administrators have a separate
dashboard for managing users, exercises, and foods.

The project is split into:

- **Frontend**: React 19, Vite, React Router, Tailwind CSS, Framer Motion, and
  React Three Fiber.
- **Backend**: Express 5, Sequelize, MySQL, Firebase Admin, Multer, and the
  Groq SDK.
- **Authentication**: Firebase Authentication on the client and Firebase ID
  token verification on protected API routes.
- **AI nutrition**: Groq is used by the backend to power the nutrition chat
  and structured nutrition-plan generation.

## Features

### User features

- Email/password registration, login, logout, and password recovery.
- Firebase-authenticated user profiles with avatar upload.
- Workout-plan generation with validation and saved-plan management.
- AI-assisted nutrition chat and saved nutrition plans.
- Exercise and food browsing.
- Workout and nutrition plan detail pages.
- PDF export for generated plans.
- Informational pages: How It Works, FAQ, and Contact.

### Administrator features

- Dashboard with administrative views.
- User management.
- Exercise catalogue management.
- Food catalogue management.

## Repository structure

```text
.
├── backend/                 # Express API, Sequelize models, migrations, and tests
├── docs/                    # Architecture documentation
├── public/                  # Frontend public assets
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/            # React context providers
│   ├── hooks/               # API and application hooks
│   ├── pages/               # Public, authenticated, and admin pages
│   ├── routes/              # React Router configuration
│   ├── services/            # External service clients, including Firebase
│   └── utils/               # PDF export helpers and other utilities
├── docker-compose.yaml
├── Dockerfile
└── package.json
```

## Prerequisites

- Node.js 20 or newer (the Dockerfiles currently use Node 26).
- npm.
- MySQL 8 or a compatible MySQL server.
- A Firebase project with Email/Password Authentication enabled.
- A Firebase Admin service-account key for the backend.
- A Groq API key for nutrition chat and plan generation.
- An EmailJS configuration for the contact form.

## Configuration

The frontend and backend use separate environment files. Do not commit real
credentials, Firebase service-account files, or API keys.

### Frontend: `.env`

Create `.env` in the repository root:

```env
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_web_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### Backend: `backend/.env`

Create `backend/.env`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fit_fetch
DB_PORT=3306
GROQ_API_KEY=your_groq_api_key
```

Place the Firebase Admin SDK service-account JSON at:

```text
backend/firebase/serviceAccountKey.json
```

This file is intentionally ignored by Git. Obtain it from **Firebase Console
→ Project settings → Service accounts → Generate new private key**.

The frontend currently calls the API at `http://localhost:3000`, and the
backend allows the Vite origins `http://localhost:5173` and
`http://localhost:5174`. Update the API URLs and CORS configuration before
deploying to another environment.

## Local development

1. Install frontend dependencies:

   ```bash
   npm install
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Create the `fit_fetch` MySQL database and configure `backend/.env`.

4. Run the Sequelize migrations from the backend directory:

   ```bash
   npx sequelize-cli db:migrate --config config/config.js --migrations-path migrations
   ```

5. Start the backend in one terminal:

   ```bash
   cd backend
   npm run dev
   ```

6. Start the frontend in another terminal:

   ```bash
   npm run dev
   ```

Open [http://localhost:5173](http://localhost:5173).

The backend health/database check is available at
[http://localhost:3000](http://localhost:3000).

There is currently no seed script in the repository. The administrator
catalogues must be populated through the admin interface or by an approved
database/import process.

## Docker

The repository includes Dockerfiles and a `docker-compose.yaml` for the
frontend and backend:

```bash
docker compose up --build
```

The containers expose the frontend on port `5173` and the backend on port
`3000`. MySQL is not defined as a Compose service, so a MySQL instance must
already be available and reachable using the backend database settings.
Review the Compose environment-file mapping and provide the required
credentials before relying on this setup outside local development.

## Available scripts

### Frontend

Run these commands from the repository root:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

### Backend

Run these commands from `backend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start Express with Nodemon |
| `npm start` | Start Express without Nodemon |
| `npm test` | Run the Jest test suite |

## API overview

All API routes are served from `http://localhost:3000/api`.
Firebase-authenticated routes expect an ID token in the `Authorization` header.
Administrator routes additionally require an administrator role.

| Resource | Main endpoints |
| --- | --- |
| Users | `POST /users/sync`, `GET /users/me`, `PUT /users/me`, admin CRUD under `/users` |
| Exercises | `GET /exercises/all`, `GET /exercises/:id`, admin CRUD under `/exercises` |
| Foods | `GET /foods`, `GET /foods/:id`, admin CRUD under `/foods` |
| Workout plans | `POST /workout-plans/generate`, `GET /workout-plans/user/plans`, `GET /workout-plans/:id`, save/delete endpoints |
| Nutrition plans | `POST /nutrition-plans/chat`, `POST /nutrition-plans`, `GET /nutrition-plans/user/plans`, save/delete endpoints |

Uploaded avatars are served from `/uploads`.

## Testing and quality checks

Run the backend tests with:

```bash
cd backend
npm test
```

Run the frontend lint check with:

```bash
npm run lint
```

## Architecture

The backend follows a route → middleware → controller → Sequelize model
structure. Firebase verifies identity, role middleware protects administrator
operations, and MySQL stores users, exercises, foods, workout plans, and
nutrition plans. The architecture diagram is available in
[`docs/5.1.3-PlantUML-Diagrama.puml`](docs/5.1.3-PlantUML-Diagrama.puml).

## License

This project is distributed under the terms of the [ISC License](LICENSE).
