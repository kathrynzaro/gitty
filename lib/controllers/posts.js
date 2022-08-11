const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const response = await Post.getAll();
      res.json(response);
    } catch (e) {
      next(e);
    }
  });
