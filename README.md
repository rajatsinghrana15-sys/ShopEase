# ShopEase — MERN learning project

A small, full-stack ShopEase storefront rebuilt as a learning project. The supplied `ShopEase-web.zip` contained a Vite HTML shell and a large `node_modules` folder, but no React source or backend. This project keeps the ShopEase name and turns that starting point into a complete store you can learn from.

## What is included

- Separate public landing page and signed-in product catalog with an auto-rotating offers banner, category filters, search, product details, reusable product cards, cart, and checkout pages.
- Express API with MongoDB models for users, products, and orders.
- Password hashing with bcrypt, signed JWT sessions, validation with Zod, protected user/order routes, admin-only endpoints, Helmet headers, CORS, and sign-in rate limiting.
- Demo catalog fallback so the frontend is viewable before the API is connected. Seed MongoDB with `npm run seed` to enable real checkout.
- Cash-on-delivery checkout records real orders in MongoDB. Customers may cancel placed or processing orders; cancelled items return to stock. Shipping is $5.99 below $75 and free at $75 or more. No card details are collected.
- Customers can review products after delivery. The admin dashboard shows customer reviews alongside the account they came from.
- Product listings and details require sign-in in both the React app and API. The landing page remains public.

## Frontend structure

- `client/src/pages/` contains the landing page, signed-in shop, sign-in and registration, product details/reviews, checkout, customer dashboard, admin dashboard, and not-found page. Page styles are stored beside their page files.
- `client/src/components/` contains shared site header/footer, product cards, offer slider, cart drawer, and protected-page guard. Component styles are stored beside their component files.
- `client/src/contexts/` keeps authentication, cart, and product data in separate providers.
- `client/src/lib/api.js` contains the shared API request helper.
- `client/src/router/` handles page URLs and browser back/forward navigation.

## Requirements

Install Node.js 20 or newer and run MongoDB locally, or use a MongoDB Atlas connection string. Internet is needed for the Google font and demo product photos.

## Run it locally

### Jaldi shuru karne ke steps (Windows)

1. ZIP par right-click karke **Extract All** choose karo. MongoDB local chalao, ya MongoDB Atlas connection string lo.
2. `server/.env.example` ki copy `server/.env` naam se banao. `MONGODB_URI` mein apni database connection string dalo. `JWT_SECRET` ko 32 ya zyada characters ke random secret se badlo. `ADMIN_EMAIL` aur `ADMIN_PASSWORD` apne admin login ke liye set karo.
3. `server` folder mein terminal kholo aur `npm install`, phir `npm run seed`, phir `npm run dev` chalao.
4. Doosra terminal `client` folder mein kholo aur `npm install`, phir `npm run dev` chalao.
5. Terminal mein dikhaya gaya Vite address browser mein kholo, aam taur par `http://localhost:5173`.

Admin dashboard ke liye seed karte waqt banaye gaye admin email/password se sign in karo. Login ke baad admin ko seedha `/admin` dashboard par bheja jayega. Customers ko `/account` dashboard milega.

### Detailed setup

1. Open a terminal in `server`, install packages with `npm install`, and copy `.env.example` to `.env`.
2. In `server/.env`, set `MONGODB_URI` and replace `JWT_SECRET` with a long random string (at least 32 characters). Keep or change `ADMIN_EMAIL` and `ADMIN_PASSWORD` to create an admin account when seeding; use a unique password.
3. Start the API with `npm run dev`. It listens on `http://localhost:5000`.
4. In another terminal, open `client`, run `npm install`, and copy `.env.example` to `.env` if you want to change the API URL.
5. Start the storefront with `npm run dev`; open the Vite URL shown in the terminal (normally `http://localhost:5173`).
6. In a third terminal, open `server` and run `npm run seed` to add the sample catalog and create the admin account. You can visit the storefront without MongoDB, but registration, accounts, admin tools, and checkout need the API and database running.

### Admin access

After seeding, sign in with the email/password from `server/.env`. Admins land on `/admin`, where they can add and edit products, hide or restore products, update order status, enable or disable customer accounts, and see reviews for each account. Customers land on `/account` to see their orders, cancel placed or processing orders, and update their display name. Customers can submit or update a product review after an order is delivered.

For production, build the client with `npm run build` from `client`, set `NODE_ENV=production`, use a strong secret and a restricted `CLIENT_URL`, and serve the client over HTTPS. Do not commit either `.env` file.

## API map

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | API/database status |
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Sign in |
| GET | `/api/auth/me` | Signed in | Current account |
| PATCH | `/api/users/me` | Signed in | Update display name |
| GET | `/api/users` | Admin | List recent users |
| PATCH | `/api/users/:id/status` | Admin | Enable/disable a customer account |
| GET | `/api/products` | Signed in | Browse/search products |
| GET | `/api/products/:id` | Signed in | Product detail |
| GET | `/api/products/:id/reviews` | Signed in | View product reviews |
| POST | `/api/products/:id/reviews` | Signed in, delivered purchase required | Add/update a product review |
| GET | `/api/admin/products` | Admin | Manage the product catalog |
| POST | `/api/admin/products` | Admin | Add a product |
| PATCH | `/api/admin/products/:id` | Admin | Edit a product |
| DELETE | `/api/admin/products/:id` | Admin | Hide a product |
| PATCH | `/api/admin/products/:id/visibility` | Admin | Restore a hidden product |
| POST | `/api/orders` | Signed in | Place an order and reserve stock |
| GET | `/api/orders/mine` | Signed in | View own order history |
| PATCH | `/api/orders/:id/cancel` | Signed in, own placed/processing order | Cancel an order and return stock |
| GET | `/api/admin/orders` | Admin | Review orders |
| GET | `/api/admin/reviews` | Admin | View customer reviews |
| PATCH | `/api/admin/orders/:id/status` | Admin | Update an order status |

## Learning milestones

1. **React basics:** components, props, state, effects, and derived product lists.
2. **Frontend flow:** search, category filters, cart quantity, forms, loading states, and local storage.
3. **REST API:** routes, JSON requests, status codes, middleware, and errors.
4. **MongoDB/Mongoose:** schemas, references, indexes, queries, and stock updates.
5. **Authentication:** bcrypt password hashes, JWT verification, and protected routes.
6. **Validation and authorization:** Zod schemas, customer/admin roles, and input limits.
7. **Order flow:** server-side prices, stock checks, saved shipping details, and order history.
8. **Production habits:** environment variables, Helmet, CORS, rate limiting, and build output.

## Notes for learning

- The browser stores the demo cart and JWT in local storage for simplicity. For a production app, consider secure, HTTP-only cookies and a more robust checkout transaction/payment integration.
- The seed script updates the sample products by name and leaves other products in place. It creates an admin only when `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set and that email is not already present.
- To test admin views, set those two variables, run the seed script, then sign in with that account.
- Product images are remote Unsplash URLs; replace them with assets you own before publishing.
