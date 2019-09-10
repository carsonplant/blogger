
import express from 'express'
import BlogService from '../services/BlogService';
import { Authorize } from '../middleware/authorize.js'
// @ts-ignore
import CommentService from '../services/CommentService.js';

let _blogService = new BlogService().repository
let _commentService = new CommentService().repository

export default class BlogController {
    constructor() {
        this.router = express.Router()
            //NOTE all routes after the authenticate method will require the user to be logged in to access
            .get('', this.getAllBlogs)
            .get('/:id', this.getBlogById)
            .get('', this.getAllComments)
            .use(Authorize.authenticated)
            .post('', this.createBlog)
            .put('/:id', this.editBlog)
            .delete('/:id', this.deleteBlog)
    }

    async getAllBlogs(req, res, next) {
        try {
            let data = await _blogService.find({}).populate("author", "name")
            return res.send(data)
        } catch (error) { next(error) }

    }

    async getBlogById(req, res, next) {
        try {
            let data = await _blogService.findById(req.params.id).populate("author", "name")
            if (!data) {
                throw new Error("Invalid Id")
            }
            res.send(data)
        } catch (error) { next(error) }
    }

    async getAllComments(req, res, next) {
        try {
            let data = await _commentService.find({ blogId: req.params.id }).populate("blogId", "name").populate("author", "name")
            return res.send(data)
        } catch (error) { next(error) }

    }
    async createBlog(req, res, next) {
        try {
            //NOTE the user id is accessable through req.body.uid, never trust the client to provide you this information
            req.body.author = req.session.uid
            let data = await _blogService.create(req.body)
            res.send(data)
        } catch (error) { next(error) }
    }

    async editBlog(req, res, next) {
        try {
            let data = await _blogService.findOneAndUpdate({ _id: req.params.id, author: req.session.uid }, req.body, { new: true })
            if (data) {
                return res.send(data)
            }
            throw new Error("invalid id")
        } catch (error) {
            next(error)
        }
    }

    async deleteBlog(req, res, next) {
        try {
            await _blogService.findOneAndRemove({ _id: req.params.id, author: req.session.uid })
            res.send("deleted blog")
        } catch (error) { next(error) }

    }

}