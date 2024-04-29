## Social-App

Social media website where users can post and follow their friends! along with a realtime chat feature across users.
Deployed at: https://social-app-b8kg.onrender.com
<br>

### Features

- Login/Register authentication using JWT tokens
- Create/Delete posts with images
- Like/Unlike and comment to posts
- Follow/Unfollow users to see their posts in feed
- Realtime chat application that can send images with seen/unseen status, notification alerts

<br>

### Technologies

Frontend: React, Chakra UI, Recoil

Backend: Express.js, MongoDB, Cloudinary, JWT, Socket.IO
<br><br>

### Screenshots

![Homepage](/frontend/src/assets/home.png)
![Profile](/frontend/src/assets/profile.png)
![Login](/frontend/src/assets/login.png)
<br><br>

### Installation and Setup

First setup Cloudinary account and MondoDB cluster then initialize .env file in root with the following:

<sup> \*Make sure you allow all network access in your MongoDB cluster by navigating to Security->Network Access->Edit->Allow access from anywhere. </sup>

```sh
PORT =
MONGO_URI =
JWT_SECRET =
CLOUDINARY_CLOUD_NAME =
CLOUDINARY_API_KEY =
CLOUDINARY_API_SECRET =
```

Build and run application with:

```sh
npm run build
npm start
```

<br>

### Bugs/Future implementations:

- Implement cron.js so render server doesn't spin down
- Add ability to login as Test User for demo
- Implement Replies tab in profile
- Fix incorrect last message text in coversation tab
- Gives wrong error message (Invalid hook call. Hooks can only be called inside of the body of a function component.) when attempting to post without text. TEMP FIXED
