# Admin Authentication System

This project now includes a secure cookie-based authentication system for admin routes.

## Features

- **Secure Login**: Admin authentication using bcrypt password verification
- **HTTP-Only Cookies**: Session cookies are HTTP-only for security
- **Automatic Redirects**: Unauthenticated users are redirected to login page
- **Logout Functionality**: Clear logout with cookie removal
- **Route Protection**: All admin routes are protected by authentication middleware

## Files Created/Modified

### Server-Side Authentication Functions

- `src/shared/server/functions/admin-auth.ts` - Core authentication utilities

### API Endpoints

- `src/routes/api/admin/login/+server.ts` - Login (POST) endpoint
- `src/routes/api/admin/logout/+server.ts` - Logout (DELETE) endpoint

### Admin Routes

- `src/routes/admin/+layout.server.ts` - Server-side authentication check
- `src/routes/admin/+layout.svelte` - Admin layout with logout button
- `src/routes/admin/+page.svelte` - Admin dashboard page
- `src/routes/admin/login/+page.svelte` - Login form

## How It Works

1. **Unauthenticated Access**: When users visit `/admin` without authentication, they are automatically redirected to `/admin/login`

2. **Login Process**:
   - User enters password on `/admin/login`
   - POST request to `/api/admin/login` validates password with bcrypt
   - On success, secure HTTP-only cookie is set
   - User is redirected to `/admin` dashboard

3. **Authenticated Access**:
   - All admin routes check for valid authentication cookie
   - Admin layout displays logout button
   - Protected content is accessible

4. **Logout Process**:
   - User clicks logout button
   - DELETE request to `/api/admin/logout` clears the auth cookie
   - User is redirected to login page

## Security Features

- **HTTP-Only Cookies**: Prevents XSS attacks by making cookies inaccessible to JavaScript
- **Secure Flag**: Cookies are marked secure in production (HTTPS only)
- **SameSite**: Strict SameSite policy prevents CSRF attacks
- **7-Day Expiry**: Sessions automatically expire after 7 days
- **Bcrypt**: Password verification uses secure bcrypt hashing

## Environment Variables

Make sure `ADMIN_PASSWORD` is set as a bcrypt hash in your environment variables.

## Usage

1. Visit `/admin` - you'll be redirected to login if not authenticated
2. Enter your admin password on the login page
3. Access the admin dashboard and use the logout button when finished
4. All admin subroutes will be automatically protected by the same authentication system

## Adding New Admin Routes

To add new admin routes, simply create them under `src/routes/admin/`. They will automatically inherit the authentication protection from the layout.

Example:

- `src/routes/admin/users/+page.svelte` - Will be protected automatically
- `src/routes/admin/settings/+page.svelte` - Will be protected automatically
