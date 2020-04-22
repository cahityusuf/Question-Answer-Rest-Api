const mongoose = require("mongoose");
const Question = require("./question");
const CustomError = require("../helpers/error/customError")
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    content: {
        type: String,
        required: [true, "Please provide a content"],
        minlength: [10,"Please provide a content at least 10 characters"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: [
        {
            type:mongoose.Schema.ObjectId,
            ref: "User"
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "Users",
        required: true
    },
    question: {
        type: mongoose.Schema.ObjectId,
        ref: "Question",
        required: true
    }
});

AnswerSchema.pre("save", async function (next) {
   if (!this.isModified("user")) {
       return next();
   }
   try {
    const question = await Question.findById(this.question);
    question.answers.push(this._id);
    question.answerCount = question.answers.length;
    await question.save();
    next();
   } catch (error) {
       return next(new CustomError(`Soru tablosuna cevap Id ekleme işlemi başarısız. ${error}`,400));
   }


});

module.exports = mongoose.model("Answer",AnswerSchema)