import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({
    title: { type: String, required: true },
    summary: { type: String, required: true },
    author: { type: ObjectId, ref: 'User', required: true },
    imgUrl: { type: String },
    body: { type: String }
}, { timestamps: true })

export default class ValueService {
    get repository() {
        return mongoose.model('blog', _model)
    }
}