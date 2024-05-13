import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

const getUserProfile = async (req, res) => {
  // fetch user using username or userId
  const { query } = req.params;
  try {
    let user;

    // query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select('-password')
        .select('-updatedAt');
    } else {
      // query is username
      user = await User.findOne({ username: query })
        .select('-password')
        .select('-updatedAt');
    }

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('Error in getUserProfile: ', error.message);
  }
};

const getFollowers = async (req, res) => {
  const { username } = req.params;
  try {
    let followers = [];
    const followerIds = await User.findOne({ username }).select('followers');
    followers = await User.find({ _id: { $in: followerIds.followers } })
      .select('-password')
      .select('-updatedAt')
      .select('-following')
      .select('-followers');

    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('Error in getFollowers: ', error.message);
  }
};

const getFollowing = async (req, res) => {
  const { username } = req.params;
  try {
    let following = [];
    const followingIds = await User.findOne({ username }).select('following');
    following = await User.find({ _id: { $in: followingIds.following } })
      .select('-password')
      .select('-updatedAt')
      .select('-following')
      .select('-followers');

    res.status(200).json(following);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('Error in getFollowing: ', error.message);
  }
};

const signupUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      res.status(400).json({ error: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('Error in signupUser: ', error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ''
    ); // add (|| '') to prevent error if user is null

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('Error in loginUser: ', error.message);
  }
};

const logoutUser = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('Error in logoutUser: ', error.message);
  }
};

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ error: 'You cannot follow/unfollow yourself' });

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: 'User not found' });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } }); // remove us from thei followers list
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } }); // remove them from our following list
      res.status(200).json({ message: 'User unfollowed successfully' });
    } else {
      // Follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } }); // add us to their followers list
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } }); // add them to our following list
      res.status(200).json({ message: 'User followed successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('Error in follow/unfollow user: ', error.message);
  }
};

const updateUser = async (req, res) => {
  const { name, username, email, password, bio } = req.body;
  let { profilePic } = req.body;

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.params.id !== userId.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot update other user's profiles" });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split('/').pop().split('.')[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    // Find all posts by user and update their username and profilePic
    await Post.updateMany(
      { 'replies.userId': userId },
      {
        $set: {
          'replies.$[reply].username': user.username,
          'replies.$[reply].userProfilePic': user.profilePic,
        },
      },
      { arrayFilters: [{ 'reply.userId': userId }] }
    );

    // Remove password from response
    user.password = null;

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log('Error in updateUser: ', error.message);
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByYou = await User.findById(userId).select('following');

    const users = await User.aggregate([
      { $match: { _id: { $ne: userId } } },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByYou.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => {
      user.password = null;
    });

    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  signupUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  getFollowers,
  getFollowing,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
};
