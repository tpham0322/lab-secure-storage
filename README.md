# Lab 2: Secure Record Storage

## Description

This project is a secure Notes API built with Node.js, Express, MongoDB, and Mongoose.

The purpose of this lab is to implement ownership-based authorization so that authenticated users can only access, update, and delete their own notes.

Each note is associated with the user who created it through a MongoDB ObjectId reference.

## Features

- User registration and authentication
- JWT-based authentication
- Password hashing with bcrypt
- Create notes
- Retrieve notes belonging to the logged-in user
- Update notes owned by the logged-in user
- Delete notes owned by the logged-in user
- Prevent users from modifying notes belonging to other users
- MongoDB data persistence with Mongoose

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens
- bcrypt
- dotenv

## Installation

Clone the repository and navigate into the project directory.

```bash
cd lab-secure-storage
```

Install the dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root of the project.

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/lab-secure-storage
JWT_SECRET=your_super_secret_jwt_key
PORT=3001
NODE_ENV=development
```

Replace the MongoDB username, password, and cluster information with your own MongoDB Atlas credentials.

Do not commit the `.env` file to GitHub.

## Running the Server

Start the server with:

```bash
node server.js
```

The server runs on:

```text
http://localhost:3001
```

## API Endpoints

### User Registration

**POST**

```text
/api/users/register
```

Example request:

```json
{
  "username": "user1",
  "email": "user1@test.com",
  "password": "password123"
}
```

### User Login

**POST**

```text
/api/users/login
```

Example request:

```json
{
  "email": "user1@test.com",
  "password": "password123"
}
```

The response provides a JWT token that must be used for authenticated requests.

### Get User Notes

**GET**

```text
/api/notes
```

Header:

```text
Authorization: Bearer YOUR_TOKEN
```

Only notes belonging to the authenticated user are returned.

### Create a Note

**POST**

```text
/api/notes
```

Header:

```text
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

Example request:

```json
{
  "title": "My Note",
  "content": "This is my note."
}
```

The note is automatically associated with the authenticated user's ID.

### Update a Note

**PUT**

```text
/api/notes/:id
```

Header:

```text
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

Example request:

```json
{
  "title": "Updated Note",
  "content": "Updated note content."
}
```

Users can only update notes that they own.

A user attempting to update another user's note receives:

```text
403 Forbidden
```

### Delete a Note

**DELETE**

```text
/api/notes/:id
```

Header:

```text
Authorization: Bearer YOUR_TOKEN
```

Users can only delete notes that they own.

A user attempting to delete another user's note receives:

```text
403 Forbidden
```

## Authorization

All note routes use the authentication middleware.

When a user creates a note, the authenticated user's ID is stored in the note:

```js
user: req.user._id
```

When retrieving notes, the API filters by the authenticated user's ID:

```js
Note.find({
  user: req.user._id,
});
```

Before updating or deleting a note, the API compares the note owner with the authenticated user.

If the IDs do not match, the API returns a `403 Forbidden` response.

## Testing

The API was tested using Postman.

### User 1

1. Register User 1.
2. Copy the JWT token.
3. Create a note using User 1's token.
4. Retrieve notes using User 1's token.
5. Verify that User 1 can see their note.

### User 2

1. Register User 2.
2. Copy the JWT token.
3. Retrieve notes using User 2's token.
4. Verify that User 2 receives an empty array because User 2 does not own User 1's note.

### Unauthorized Update

Use User 2's token to update User 1's note.

Expected response:

```text
403 Forbidden
```

```json
{
  "message": "User is not authorized to update this note."
}
```

### Unauthorized Delete

Use User 2's token to delete User 1's note.

Expected response:

```text
403 Forbidden
```

```json
{
  "message": "User is not authorized to delete this note."
}
```

### Authorized Update and Delete

Use User 1's token to update and delete User 1's note.

Expected results:

```text
200 OK
```

## Project Structure

```text
lab-secure-storage/
├── config/
│   └── connection.js
├── models/
│   ├── index.js
│   ├── Note.js
│   └── User.js
├── routes/
│   ├── index.js
│   └── api/
│       ├── index.js
│       ├── noteRoutes.js
│       └── userRoutes.js
├── utils/
│   └── auth.js
├── .env
├── .gitignore
├── .env.example
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## Security

- Passwords are hashed using bcrypt before being stored.
- JWTs are used to authenticate users.
- Notes store an ObjectId reference to their owner.
- Users can only retrieve their own notes.
- Users cannot update notes belonging to another user.
- Users cannot delete notes belonging to another user.
- Environment variables are used for sensitive configuration.
- The `.env` file should not be committed to version control.

## Author

Truong Pham
