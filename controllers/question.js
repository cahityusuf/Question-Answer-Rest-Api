const Question = require("../models/question");
const CustomError = require("../helpers/error/customError");
const asyncErrorWrapper = require("express-async-handler");

const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {
  const information = req.body;

  const question = await Question.create({
    ...information,
    user: req.user.id,
  });

  res.status(200).json({
    success: true,
    data: question,
  });
});

const getAllQuestion = asyncErrorWrapper(async (req, res, next) => {
  
  return res.status(200).json(res.queryResults);
});

const getSingleQuestion = asyncErrorWrapper(async (req, res, next) => {
  return res.status(200).json(res.queryResults);
});

const editQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  const information = req.body;

  let question = await Question.findByIdAndUpdate(
    id, //arama yapılacak id
    {
      ...information, //güncelleme yapılaca alanları, req.body ne gelirse..
    },
    {
      new: true, // güncelle yapıldıktan sonra güncel alanların geri dönmesi için
      runValidators: true,
    }
  );

  return res.status(200).json({
    success: true,
    data: question,
  });
});

const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  let question = await Question.findByIdAndRemove(id);

  if (!question) {
    new CustomError("Sime işlemi başarısız", 400);
  }

  return res.status(200).json({
    success: true,
    data: "Delete Question Successfull",
  });
});

const likeQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params; //requesten id alınır.

  let question = await Question.findById(id); //id ye göre ilgili soru bulunur

  if (question.likes.includes(req.user.id)) {
    //bulunan soruda beğeni yapan kullnacıı mevcutmu. yani daha önce beğenmiş mi
    return next(new CustomError("You already liked this question", 400));
  }
  question.likes.push(req.user.id); //il defa beğeniyorsa likes dizininie id sini ekle
  question.likeCount = question.likes.length;
  const likeQuestion = await question.save(); // daha sonra kaydet

  if (!likeQuestion) {
    return next(new CustomError("Beğeni Kayıt işlemi başarısız", 400));
  }

  return res.status(200).json({
    success: true,
    data: likeQuestion,
  });
});

const undoLikeQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params; //requesten id alınır.

  let question = await Question.findById(id); //id ye göre ilgili soru bulunur

  if (!question.likes.includes(req.user.id)) {
    return next(
      new CustomError("You can not undo like operation for this question", 400)
    );
  }

  const index = question.likes.indexOf(req.user.id);

  question.likes.splice(index, 1);
  question.likeCount = question.likes.length;
  const undoLike = await question.save();

  if (!undoLike) {
    return next(new CustomError("Kayıt işlemi başarısız", 400));
  }
  return res.status(200).json({
    success: true,
    data: undoLike,
  });
});

module.exports = {
  askNewQuestion,
  getAllQuestion,
  getSingleQuestion,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  undoLikeQuestion,
};
