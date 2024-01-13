const express = require('express');
const router = express.Router();
const { getUsers, getUserById } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.get('/profile', authMiddleware, (req, res) => {
  });
module.exports = router;