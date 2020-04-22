const Question = require("../models/question");
const Answer = require("../models/answer");
const CustomError = require("../helpers/error/customError");
const asyncErrorWrapper = require("express-async-handler");

const addNewAnswerToQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { question_id } = req.params;

  const user_id = req.user.id;

  const information = req.body;

  const answer = await Answer.create({
    ...information,
    question: question_id,
    user: user_id,
  });

  if (!answer) {
    return next(new CustomError("Kayıt işlemi başarısız", 400));
  }

  return res.status(200).json({
    success: true,
    data: answer,
  });
});

const getAllAnswersByQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { question_id } = req.params;

  const question = await Question.findById(question_id).populate("answers");

  const answers = question.answers;

  return res.status(200).json({
    success: true,
    count: answers.length,
    data: answers,
  });
});

const getSingleAnswer = asyncErrorWrapper(async (req, res, next) => {
  try {
    const { answer_id } = req.params;

    const answer = await Answer.findById(answer_id)
      .populate({
        path: "question",
        select: "title",
      })
      .populate({
        path: "user",
        select: "name profile_image",
      });

    return res.status(200).json({
      success: true,
      data: answer,
    });
  } catch (error) {
    return next(
      new CustomError(`Answer Arama işlemi başarısız. ${error}`, 400)
    );
  }
});

const editAnswer = asyncErrorWrapper(async (req, res, next) => {
  try {
    const { answer_id } = req.params;
    const { content } = req.body;

    let answer = await Answer.findById(answer_id);

    answer.content = content;

    await answer.save();

    return res.status(200).json({
      success: true,
      data: answer,
    });
  } catch (error) {
    return next(new CustomError(`Update işlemi başarısız. ${error}`, 400));
  }
});

const deleteAnswer = asyncErrorWrapper(async (req, res, next) => {
  try {
    const { answer_id } = req.params;
    const { question_id } = req.params;

    await Answer.findByIdAndRemove(answer_id); //answer bulunur ve silinir

    const question = await Question.findById(question_id);//question bulunur

    question.answers.splice(question.answers.indexOf(answer_id), 1);//question içindeki answer dizininde bulunan awaswer id si bulunur ve silinir.
    question.answersCount = question.answers.length;
    await question.save();

    return res.status(200).json({
      success: true,
      data: "Answer Deleted Successfully",
    });
  } catch (error) {
    return next(new CustomError(`Silemişlemi başarısız. ${error}`, 400));
  }
});

const likeAnswer = asyncErrorWrapper(async (req, res, next) => {
    try {

    const { answer_id } = req.params; //requesten id alınır.
  
    let answer = await Answer.findById(answer_id); //id ye göre ilgili soru bulunur

    if(answer.likes.includes(req.user.id)){ //bulunan soruda beğeni yapan kullnacıı mevcutmu. yani daha önce beğenmiş mi
      return next(new CustomError("You already liked this question",400));
    }
    answer.likes.push(req.user.id); //il defa beğeniyorsa likes dizininie id sini ekle

    const likeQuestion = await answer.save();// daha sonra kaydet

    if (!likeQuestion) {
      return next(new CustomError("Beğeni Kayıt işlemi başarısız",400));
    }
 
    return res.status(200).json({
      success: true,
      data: likeQuestion
    });

    } catch (error) {
      return next(new CustomError(`Beğenme işlemi başarısız. ${error}`, 400));
    }
  });

  const undoLikeAnswer = asyncErrorWrapper(async (req, res, next) => {
    try {
        const { answer_id } = req.params; //requesten id alınır.
  
        let answer = await Answer.findById(answer_id); //id ye göre ilgili soru bulunur
    
        if (!answer.likes.includes(req.user.id)) {
          return next(new CustomError("You can not undo like operation for this question",400));
        }
     
        const index = answer.likes.indexOf(req.user.id);
    
        answer.likes.splice(index,1);
    
        const undoLike = await answer.save();
    
        if (!undoLike) {
          return next(new CustomError("Kayıt işlemi başarısız",400));
        }
        return res.status(200).json({
          success: true,
          data: undoLike
        });
    } catch (error) {
      return next(new CustomError(`Silemişlemi başarısız. ${error}`, 400));
    }
  });


module.exports = {
  addNewAnswerToQuestion,
  getAllAnswersByQuestion,
  getSingleAnswer,
  editAnswer,
  deleteAnswer,
  likeAnswer,
  undoLikeAnswer
};
