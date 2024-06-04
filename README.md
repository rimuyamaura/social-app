# Social-App

Social media website where users can post and follow their friends! along with a realtime chat feature across users.
Deployed at: https://social-app-b8kg.onrender.com

## Features

- Create/Edit/Delete posts with images
- Like/Unlike and comment to posts
- Follow/Unfollow users to see their posts in your feed, and view other user's followers via their profile page
- Realtime chat that can send images with seen/unseen status, notification alerts
- Login/Register authentication using JWT tokens, and ability to demo the application as a guest user

## Technologies

Frontend: React, Chakra UI, Recoil

Backend: Express.js, MongoDB, Cloudinary, JWT, Socket.IO

## Screenshots

![Homepage](/frontend/src/assets/home.PNG)
![Profile](/frontend/src/assets/profile.PNG)
![Chat](/frontend/src/assets/chat.PNG)
![Login](/frontend/src/assets/login.PNG)

## Installation and Setup

First setup Cloudinary account and MondoDB cluster then initialize .env file in root with the following:

```sh
PORT =
MONGO_URI =
JWT_SECRET =
CLOUDINARY_CLOUD_NAME =
CLOUDINARY_API_KEY =
CLOUDINARY_API_SECRET =
```

<sup> \*Make sure you allow all network access in your MongoDB cluster by navigating to Security->Network Access->Edit->Allow access from anywhere. </sup>

Build and run application with:

```sh
npm run build
npm start
```

## Bugs/Future implementations:

- Record creation dates for replies so replies can be sorted by date

## Links

- [As a Programmer Youtube Channel](https://www.youtube.com/@asaprogrammer_)
- [Chakra UI Docs](https://v2.chakra-ui.com)
