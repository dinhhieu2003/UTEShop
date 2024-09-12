# UTEShop

UTEShop is a backend server application for an e-commerce platform built with Node.js, Express, TypeScript, and MongoDB.

## Prerequisites

- Node.js
- MongoDB Atlas account

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add your environment variables:
   ```
   PASSWORD_MONGODB=your_mongodb_password
   PORT=6969
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   JWT_SECRET=your_jwt_secret
   ```

## Scripts

- `npm start`: Start the development server with hot-reloading
- `npm run build`: Build the project for production

## Project Structure

- `src/`: Source code
  - `index.ts`: Main application file
  - `models/`: Database models
  - `routes/`: API routes
  - `controllers/`: Request handlers
  - `services/`: Business logic
  - `middlewares/`: Custom middleware functions
  - `utils/`: Utility functions
  - `dto/`: Data Transfer Objects
- `dist/`: Compiled JavaScript output

## Technologies Used

- Express.js
- MongoDB with Mongoose
- TypeScript
- Babel for transpilation
- Nodemon for development
- JSON Web Tokens (JWT) for authentication
- Bcrypt-nodejs for password hashing
- Nodemailer for sending emails

## API Endpoints

### Auth
- POST `/api/v1/auth/register`: Register a new user
- POST `/api/v1/auth/verify-otp`: Verify OTP for account activation
- POST `/api/v1/auth/login`: User login
- POST `/api/v1/auth/forgot-password`: Request password reset
- POST `/api/v1/auth/reset-password`: Reset password with OTP

## License

ISC