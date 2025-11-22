# TinyLink (MySQL)

TinyLink is a small URL shortener built with Next.js (App Router) and MySQL.

## Local setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `BASE_URL`.
2. Create the `links` table in your MySQL database. Example SQL in `migrations/mysql-init.sql`.
3. Install dependencies:

```bash
npm install
4.	Start dev server:
npm run dev
5.	Visit http://localhost:3000
Endpoints (required by autograder)
•	GET /healthz → returns 200 JSON
•	POST /api/links → create a link (409 if code exists)
•	GET /api/links → list all links
•	GET /api/links/:code → link details
•	DELETE /api/links/:code → delete link
•	GET /:code → redirect (302) or 404 if missing
Notes
•	Codes must match [A-Za-z0-9]{6,8} when supplied as custom codes.
Deployment
•	Push to GitHub and connect to Vercel.
•	Add DATABASE_URL and BASE_URL secrets in Vercel settings.
•	Run DB migration once (e.g. use MySQL Workbench or CLI). ```
________________________________________
Final notes
•	This project follows the required API routes and stable URLs.
•	It uses server-side lib/db.js for database access using mysql2.
•	UI is minimal but functional, responsive, and includes loading/error states.
If you’d like, I can: - Create a ready-to-push GitHub repo with these files. - Produce a short screen-recording script for the video submission. - Walk you step-by-step through deploying to Vercel + ClearDB / PlanetScale / Railway MySQL.
Tell me which you’d like next.
