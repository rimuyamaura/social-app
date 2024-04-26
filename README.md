## Social-App

Social media website where users can Post and follow their friends! along with a realtime chat feature accross users.

### Technologies

Frontend: React, Chakra UI, Recoil

Backend: Express.js, MongoDB, Cloudinary, JWT, Socket.IO

### Screenshots

### Installation and Setup

Create .env file in root with the following:

```sh
PORT =
MONGO_URI =
JWT_SECRET =
CLOUDINARY_CLOUD_NAME =
CLOUDINARY_API_KEY =
CLOUDINARY_API_SECRET =
```

```sh
npm run build
npm start
```

24/04 up to 11:51

### Bugs/Future implementations:

- Add ability to login as Test User for demo
- Implement Replies tab in profile
- Gives wrong error message (Invalid hook call. Hooks can only be called inside of the body of a function component.) when attempting to post without text. TEMP FIXED
