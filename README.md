# Blood Donation Platform — Client

The Blood Donation Platform client is a polished, production-grade Next.js application designed to support blood donation coordination across donors, volunteers, administrators, and hospitals.

## Live deployments

- Client: https://client-blood-donation.vercel.app/
- API server: https://server-tan-three.vercel.app/

## Repository links

- Client repo: https://github.com/shahrierbiddut/blood_donation_client
- Server repo: https://github.com/shahrierbiddut/blood_donation_server

## System overview

This client is the end-user interface for a role-based blood donation ecosystem. It is built to:

- display urgent donation requests and available donors
- support secure login for Donor, Volunteer, and Admin roles
- enforce protected access for funding and dashboard pages
- deliver a unified experience across desktop and mobile devices
- enable fast interaction with backend APIs for donations, funding, and messaging

## Core functionality

### Public pages

- Landing page with mission, statistics, and action links
- Donation request browse page
- Donor search page
- About and contact pages

### Authentication and roles

- Email/password login and registration
- Role-aware dashboard routing for `admin`, `volunteer`, and `donor`
- Protected routes for authenticated dashboard access
- Shared navigation that hides protected actions from public users

### Dashboard and funding

- Role-specific dashboards for workflow and data access
- Funding page available only after login
- Funding history, search, totals, and payment integration
- Support for Stripe session creation and transaction tracking

### Support and communications

- Contact form integration with backend messaging
- Contact support links visible on volunteer and public pages
- Dashboard access to user-specific functions and messages

## Demo credentials

- Volunteer: `sadia@gmail.com` / `Test@12345`
- Admin: `rahim@gmail.com` / `Test@12345`
- Donor: `akashislam@gmail.com` / `Test@12345`

## Technology stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Axios for REST API requests
- React Icons for iconography
- Hero UI components for buttons and spinner elements
- Recharts for dashboard analytics and reporting

## Local development

```bash
cd client
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Environment configuration

Create a `.env.local` file in the `client/` folder with the following values as needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_JWT_STORAGE_KEY=blood_donation_auth_token
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

> `NEXT_PUBLIC_API_URL` should point to your server API endpoint.

## Project structure

- `app/` — Next.js application routes and pages
- `src/Components/` — shared UI components and dashboard modules
- `src/context/` — authentication provider and custom hooks
- `src/services/` — API client, auth service, and upload service
- `src/data/` — mock data and admin demo data

## Important implementation details

- `src/context/AuthContext.js` manages authentication state, login, logout, and token verification.
- `src/services/api.js` adds JWT tokens to requests and refreshes expired tokens.
- `src/Components/ProtectedRoute.js` enforces authentication for dashboard routes.
- `src/Components/Shared/Navbar.js` changes navigation options based on auth state.
- `app/dashboard/funding/page.js` loads funding history only for authenticated users.

## Deployment notes

- The client is deployed on Vercel and can be updated through the connected GitHub repository.
- Ensure `NEXT_PUBLIC_API_URL` points to the production server URL in Vercel environment settings.
- Keep staging and production credentials secure and do not expose them in source control.

## Maintenance and contribution guidelines

- Use consistent component patterns for shared UI elements and dashboard pages.
- Add new backend endpoints through `src/services/api.js`.
- Maintain route protection through `ProtectedRoute` for any secure view.
- Use Tailwind utility classes and shared layout wrappers for consistent styling.
- Document new features in this README and the server README as backend support is added.
