const express = require("express");
const {
  askNewQuestion,
  getAllQuestion,
  getSingleQuestion,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  undoLikeQuestion,
} = require("../controllers/question");
const answer = require("./answer");
const {
  checkQuestionExist,
} = require("../middlewares/database/databaseErrorHelpers");
const Question = require("../models/question");
const {
  questionQueryMiddleware
} = require("../middlewares/query/questionQueryMiddleware");
const {
  getAccessToRoute,
  getQuestionOwnerAccess,
} = require("../middlewares/authorization/auth");
const { answerQueryMiddleware } = require("../middlewares/query/answerQueryMiddleware");

const router = express.Router();

router.get(
  "/",
  questionQueryMiddleware(Question, {
    //yazdığımı middleware search ve pagination işlemlerin merkezileştirmek için yapılmuışıtr.
    population: {
      path: "user",
      select: "name profile_image"
    }
  }),
  getAllQuestion
);
router.post("/ask", getAccessToRoute, askNewQuestion);
router.get("/:id", checkQuestionExist,answerQueryMiddleware(Question,{
  population:[
    {
      path:"user",
      select:"name profile_image"
    },
    {
      path:"answers",
      select:"content"
    }
  ]
}), getSingleQuestion);
router.get("/:id/like", [getAccessToRoute, checkQuestionExist], likeQuestion);
router.get(
  "/:id/undo_like",
  [getAccessToRoute, checkQuestionExist],
  undoLikeQuestion
);
router.put(
  "/:id/edit",
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  editQuestion
);
router.delete(
  "/:id/delete",
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  deleteQuestion
);

router.use("/:question_id/answers", checkQuestionExist, answer);

module.exports = router;
