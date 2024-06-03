import express from 'express';
import {
  createPost,
  getPost,
  deletePost,
  editPost,
  likeUnlikePost,
  replyToPost,
  deleteReply,
  getFeedPosts,
  getUserPosts,
  getUserReplies,
} from '../controllers/postController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.get('/feed', protectRoute, getFeedPosts);
router.get('/:id', getPost);
router.get('/user/:username', getUserPosts);
router.get('/reply/:username', getUserReplies);
router.post('/create', protectRoute, createPost);
router.put('/edit/:id', protectRoute, editPost);
router.put('/like/:id', protectRoute, likeUnlikePost);
router.put('/reply/:id', protectRoute, replyToPost);
router.delete('/reply/:postId/:replyId', protectRoute, deleteReply);
router.delete('/:id', protectRoute, deletePost);

export default router;
