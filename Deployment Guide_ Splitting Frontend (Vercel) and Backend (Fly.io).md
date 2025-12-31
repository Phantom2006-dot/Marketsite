# Deployment Guide: Splitting Frontend (Vercel) and Backend (Fly.io)

**Author:** Manus AI
**Date:** December 31, 2025

This guide provides a step-by-step process to deploy your **Marketsite** project with a split architecture: the **Frontend (React/Vite)** on Vercel and the **Backend (Express/Drizzle)** on Fly.io.

The project analysis confirms that your current setup is a monorepo where the backend server also serves the frontend. This guide details the necessary steps to separate these components and configure them to communicate correctly.

---

## 1. Backend Deployment on Fly.io

The backend is an Express.js server that handles all API logic, database connections, and file uploads (via Cloudinary). It will be deployed to Fly.io.

### 1.1. Prerequisites

1.  **Fly.io Account and CLI:** Install the Fly CLI and log in (`fly auth login`).
2.  **PostgreSQL Database:** Your application uses PostgreSQL (via Drizzle and `postgres-js`). You have two main options:
    *   **Recommended:** Use an external service like **Neon** (which your project's dependency `@neondatabase/serverless` suggests) for a managed, serverless-friendly database.
    *   **Alternative:** Create a managed PostgreSQL cluster on Fly.io (`fly postgres create`).
3.  **Cloudinary Account:** Ensure you have your Cloudinary credentials for image storage.

### 1.2. Project Preparation

The following files have been created in the root of your project to facilitate the Fly.io deployment:

| File | Purpose |
| :--- | :--- |
| `fly.toml` | Defines the Fly.io application configuration, including the internal port (`5000`) and the use of a `Dockerfile`. |
| `Dockerfile` | Specifies the build and runtime environment for your Node.js server, ensuring a consistent and efficient deployment. |
| `.dockerignore` | Excludes unnecessary files (like `node_modules` and local assets) from the Docker image to speed up the build. |

### 1.3. Environment Variables

The backend requires several environment variables to function correctly. These must be set on your Fly.io application.

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | The connection string for your PostgreSQL database (e.g., from Neon or Fly Postgres). | `postgres://user:pass@host:port/db` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name. | `my-cloud-name` |
| `CLOUDINARY_API_KEY` | Your Cloudinary API Key. | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API Secret. | `aBcDeFgHiJkLmNoPqRsTuVwXyZ` |

**To set these variables on Fly.io:**

```bash
fly secrets set DATABASE_URL="<YOUR_DATABASE_URL>"
fly secrets set CLOUDINARY_CLOUD_NAME="<YOUR_CLOUD_NAME>"
fly secrets set CLOUDINARY_API_KEY="<YOUR_API_KEY>"
fly secrets set CLOUDINARY_API_SECRET="<YOUR_API_SECRET>"
```

### 1.4. Deployment

1.  **Initialize the Fly App:**
    ```bash
    cd Marketsite-main/Marketsite-main # Navigate to the project root
    fly launch --name marketsite-backend
    # When prompted, choose "No" to the database question if you are using Neon.
    # The fly.toml file will be created (or use the one provided).
    ```
2.  **Deploy the Backend:**
    ```bash
    fly deploy
    ```
    Fly.io will use the `Dockerfile` to build and deploy your application. Once deployed, note the application's URL, which will be in the format `https://marketsite-backend.fly.dev`. This is your **BACKEND_URL**.

---

## 2. Frontend Deployment on Vercel

The frontend is a React/Vite application located in the `client` directory. It will be deployed as a static site on Vercel.

### 2.1. Project Structure Adjustment

Vercel needs to know that the build process is for the `client` directory.

1.  **Vercel Configuration File:** The `vercel.json` file has been created in the root of your project. This file is **critical** for connecting the frontend to the backend.

    ```json
    {
      "version": 2,
      "rewrites": [
        {
          "source": "/api/:path*",
          "destination": "https://marketsite-backend.fly.dev/api/:path*"
        },
        {
          "source": "/uploads/:path*",
          "destination": "https://marketsite-backend.fly.dev/uploads/:path*"
        },
        {
          "source": "/(.*)",
          "destination": "/index.html"
        }
      ]
    }
    ```

    **Action Required:** You **MUST** update the `destination` URLs in `vercel.json` to use your actual Fly.io application URL (e.g., `https://your-app-name.fly.dev`).

2.  **Frontend API Calls:** Your frontend code uses relative paths for API calls (e.g., `/api/products`). The `vercel.json` file intercepts these relative paths and **rewrites** them to the absolute `BACKEND_URL` on Fly.io, all while keeping the user on the Vercel domain. This is the most robust way to handle the split deployment.

### 2.2. Deployment on Vercel

1.  **Push to Git:** Ensure your project, including the updated `vercel.json`, is pushed to a Git repository (GitHub, GitLab, or Bitbucket).
2.  **Import Project:** In the Vercel dashboard, import your Git repository.
3.  **Configure Build Settings:** When configuring the project, you need to tell Vercel where the frontend code is located and how to build it.

| Setting | Value |
| :--- | :--- |
| **Root Directory** | `Marketsite-main/Marketsite-main` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist/public` |

    *Note: The `npm run build` script in your `package.json` first builds the client into `dist/public` and then builds the server into `dist/index.js`. Vercel will only serve the contents of the `dist/public` directory, treating it as a static site.*

4.  **Deploy:** Vercel will deploy the static assets. Once complete, your frontend will be live, and all requests to `/api/*` and `/uploads/*` will be seamlessly forwarded to your Fly.io backend.

---

## 3. Security and Connection Details

### 3.1. Connecting Frontend and Backend

You mentioned connecting them using API keys. Your current application uses a more standard approach for web applications:

*   **CORS (Cross-Origin Resource Sharing):** By using Vercel's **rewrite** feature, you avoid most CORS issues because the browser sees all requests originating from the Vercel domain.
*   **Authentication:** Your frontend uses `credentials: "include"` in its fetch requests (`client/src/lib/queryClient.ts`), which means it relies on **cookies and sessions** for authentication. The Fly.io backend must be configured to handle these sessions and set the appropriate `Set-Cookie` headers. Since the frontend and backend are on different domains (Vercel and Fly.io), you might need to ensure your Express session configuration is set up for cross-site cookies (`SameSite: "None"` and `Secure: true`).

### 3.2. Securing the Connection

The connection is secured by:

1.  **HTTPS:** Both Vercel and Fly.io enforce HTTPS, ensuring all data transmission is encrypted.
2.  **Environment Variables:** All sensitive credentials (`DATABASE_URL`, Cloudinary secrets) are stored securely as environment variables on the Fly.io server, never exposed to the public or the frontend.

By following this guide, you will have a robust, split deployment architecture for your Marketsite application.
