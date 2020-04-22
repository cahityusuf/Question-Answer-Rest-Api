const multer = require("multer");
const path = require("path");
const CustomError = require("../../helpers/error/customError");

//Storage, FileFilter

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const rootDir = path.dirname(require.main.filename);
    cb(null, path.join(rootDir, "/public/uploads"));
  },
  filename: function (req, file, cd) {
    // File -Mimetype - image/png
    const extension = file.mimetype.split("/")[1];
    const url =path.join(path.dirname(require.main.filename), "/public/uploads"+ "image_" + req.user.id + "." + extension); 
    req.ImageUrl = url;
    req.savedProfileImage ="image_" + req.user.id + "." + extension;
    cd(null, req.savedProfileImage);
  },
});

const fileFilter = (req,file,cb) =>{
    let allowedMimeTypes = ["image/jpg","image/gif","image/jpeg","image/png"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new CustomError("Plase provide a valid image file",400),false)
    }

    return cb(null,true);
};

const profileImageUpload = multer({storage,fileFilter});

module.exports = profileImageUpload;
