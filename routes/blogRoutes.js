// @ts-nocheck
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const cleanCache = require('../middlewares/cleanCache');

const Blog = mongoose.model('Blog');

module.exports = (app) => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    try {
      const blog = await Blog.findOne({
        _user: req.user.id,
        _id: req.params.id
      });

      res.send(blog);
    } catch (err) {
      console.log(err);
    }
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    try {
      const blogs = await Blog.find({ _user: req.user.id }).cache({
        key: req.user.id
      });
      res.send(blogs);
    } catch (err) {
      console.log(err);
    }
  });

  app.post('/api/blogs', requireLogin, cleanCache, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      console.log('failed to post resource');
      res.send(400, err);
    }
  });
};
