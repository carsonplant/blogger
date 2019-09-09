import express from 'express'
import CommentService from '../services/CommentService.js';
import { Authorize } from '../middleware/authorize.js'


let _commentService = new CommentService().repository

export default class CommentController {
  constructor() {
    this.router = express.Router()
      //NOTE all routes after the authenticate method will require the user to be logged in to access
      .get('', this.getAllComments)
      .use(Authorize.authenticated)
      .post('', this.createComment)
      .put('/:id', this.editComment)
      .delete('/:id', this.deleteComment)
  }

  // async getAllBlogs(req, res, next) {
  //   try {
  //     let data = await _blogService.find({})
  //     return res.send(data)
  //   } catch (error) { next(error) }

  // }

  async getAllComments(req, res, next) {
    try {
      let data = await _commentService.find({}).populate("author", "name")
      return res.send(data)
    } catch (error) { next(error) }

  }
  // async getBlogById(req, res, next) {
  //   try {
  //     let data = await _blogService.findById(req.params.id)
  //     if (!data) {
  //       throw new Error("Invalid Id")
  //     }
  //     res.send(data)
  //   } catch (error) { next(error) }
  // }

  async createComment(req, res, next) {
    try {
      //NOTE the user id is accessable through req.body.uid, never trust the client to provide you this information
      req.body.authorId = req.session.uid
      let data = await _commentService.create(req.body)
      res.send(data)
    } catch (error) { next(error) }
  }

  async editComment(req, res, next) {
    try {
      let data = await _commentService.findOneAndUpdate({ _id: req.params.id, authorId: req.session.uid }, req.body, { new: true })
      if (data) {
        return res.send(data)
      }
      throw new Error("invalid id")
    } catch (error) {
      next(error)
    }
  }

  async deleteComment(req, res, next) {
    try {
      await _commentService.findOneAndRemove({ _id: req.params.id, authorId: req.session.uid })
      res.send("deleted comment")
    } catch (error) { next(error) }

  }

}