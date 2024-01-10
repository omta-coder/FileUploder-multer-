var express = require('express');
var router = express.Router();
const fs = require("fs");

const Media = require("../models/mediaModel")
var upload = require("../utils/multer").single("avatar");

/* GET home page. */
router.get('/',async function(req, res, next) {
  try {
    const medias = await Media.find();
    res.render('index', { medias:medias });
  } catch (error) {
    res.send(error)
  }
});

router.get("/delete/:id", async function (req, res, next) {
  try {
      const media = await Media.findByIdAndDelete(req.params.id);
      fs.unlinkSync("./public/uploads/" + media.avatar);
      res.redirect("/");
  } catch (error) {
      res.send(error);
  }
});

router.post('/upload', function(req, res, next) {
  upload(req, res, async function (err) {
    if (err) throw err;
    try {
        const media = new Media({
            username: req.body.username,
            avatar: req.file.filename,
        });
        await media.save();
        res.redirect("/");
    } catch (error) {
        res.send(error);
    }
});
});



module.exports = router;
