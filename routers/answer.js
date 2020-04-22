const express = require("express");
const router = express.Router({ mergeParams: true }); //bir alt router olduüundan bir üst routerdaki değerleride buraya aktar
const { getAccessToRoute,getAnswerOwnerAccess } = require("../middlewares/authorization/auth");
const {
  checkQuestionAndAnswerExist,
} = require("../middlewares/database/databaseErrorHelpers");
const {
  addNewAnswerToQuestion,
  getAllAnswersByQuestion,
  getSingleAnswer,
  editAnswer,
  deleteAnswer,
  undoLikeAnswer,
  likeAnswer
} = require("../controllers/answer");

router.post("/", getAccessToRoute, addNewAnswerToQuestion);
router.get("/", getAllAnswersByQuestion);
router.put("/:answer_id/edit",[getAccessToRoute,checkQuestionAndAnswerExist,getAnswerOwnerAccess],editAnswer);
router.get("/:answer_id", checkQuestionAndAnswerExist, getSingleAnswer);
router.get("/:answer_id/like", [getAccessToRoute,checkQuestionAndAnswerExist], likeAnswer);
router.get("/:answer_id/undo_like", [getAccessToRoute,checkQuestionAndAnswerExist], undoLikeAnswer);
router.delete("/:answer_id/delete",[getAccessToRoute,checkQuestionAndAnswerExist,getAnswerOwnerAccess],deleteAnswer);

module.exports = router;
