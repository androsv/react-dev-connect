const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const mongoose = require("mongoose");
const passport = require("passport");
const validatePostInput = require("../../validation/post");

//@route  GET api/posts/test
//@desc   Test route for posts
//@access PUBLIC

router.get("/test", (req, res) => res.json({ msg: "posts works" }));

//@route  POST api/posts/
//@desc   create post
//@access PRIVATE

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

//@route  GET api/posts/
//@desc   get all posts
//@access PUBLIC

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: "No post available" }));
});

//@route  GET api/posts/:id
//@desc   get  post by id
//@access PUBLIC

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found for id" })
    );
});

//@route  DELETE api/posts/:id
//@desc   get  post by id
//@access PRIVATE

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          Post.findById(req.params.id).then(post => {
            if (post.user.toString() !== req.user.id) {
              return res.status(401).json({
                notauthorize: "user is not authorize to delete post "
              });
            }
            post.remove().then(() => res.json({ success: true }));
          });
        }
      })
      .catch(err => res.status(404).json({ nopostfound: "post not found" }));
  }
);

//@route  POST api/posts/like/:id
//@desc   like a post
//@access PRIVATE

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          Post.findById(req.params.id).then(post => {
            if (
              post.likes.filter(like => like.user.toString() === req.user.id)
                .length > 0
            ) {
              return res
                .status(400)
                .json({ alreadyliked: "user has already liked the post" });
            }
            post.likes.unshift({ user: req.user.id });
            post.save().then(post => res.json(post));
          });
        }
      })
      .catch(err => res.status(404).json({ nopostfound: "post not found" }));
  }
);

//@route  POST api/posts/unlike/:id
//@desc   unlike a post
//@access PRIVATE

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          Post.findById(req.params.id).then(post => {
            if (
              post.likes.filter(like => like.user.toString() === req.user.id)
                .length > 0
            ) {
              removeIndex = post.likes
                .map(like => like.user.toString())
                .indexOf(req.params.id);
              post.likes.splice(removeIndex, 1);
              post.save().then(post => res.json(post));
            } else {
              res.status(400).json({ alreadyunliked: "post is not liked" });
            }
          });
        }
      })
      .catch(err => res.status(404).json({ nopostfound: "post not found" }));
  }
);

//@route  POST api/posts/comment/:id
//@desc   comment on a post
//@access PRIVATE

router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findOne({ user: req.user.id })
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(error => res.status(400).json({ nopost: "no post found for id" }));
  }
);

//@route  DELETE api/posts/comment/:post_id/:comment_id
//@desc   comment on a post
//@access PRIVATE

router.delete(
  "/comment/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then(post => {
        if (post) {
          removeIndex = post.comments
            .map(comment => comment.id)
            .indexOf(req.params.comment_id);
          // console.log(
          //   removeIndex > 0 &&
          //     req.user.id === post.comments[removeIndex].user.toString()
          // );

          if (
            removeIndex > 0 &&
            req.user.id === post.comments[removeIndex].user.toString()
          ) {
            post.comments.splice(removeIndex, 1);
            post.save().then(post => res.json(post));
          } else {
            return res.status(404).json({ nocomment: "comment not found" });
          }
        }
      })
      .catch(error => res.status(400).json({ nopost: " post not found" }));
  }
);
module.exports = router;
