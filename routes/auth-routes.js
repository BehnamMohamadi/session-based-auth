const {
  login,
  signUp,
  checkSignUpData,
  userCompletelyData,
  checkUserCompletelyData,
  checkEditUserData,
  editUser,
  logout,
  editPassword,
  getUser,
} = require("../controller/auth-controller");

const {
  signUpValidationSchema,
  userCompletelyDataValidationSchema,
  editUserValidationSchema,
} = require("../validation/auth-validator");

const { validator } = require("../validation/validator");
const router = require("express").Router();

router.post("/login", login);
router.post("/signup", validator(signUpValidationSchema), checkSignUpData, signUp);
router.patch(
  "/complete-user-data/:username",
  validator(userCompletelyDataValidationSchema),
  checkUserCompletelyData,
  userCompletelyData
);

router.get("/get-user/:username", getUser);

router.patch(
  "/editUser/:username",
  validator(editUserValidationSchema),
  checkEditUserData,
  editUser
);

router.patch("/editPassword/:username", editPassword);

router.get("/logout/:username", logout);

module.exports = router;
