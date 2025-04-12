const router = require("express").Router();
const { protect } = require("../controller/auth-controller");
const { asyncHandler } = require("../utils/async-handler");
const { validator } = require("../validation/validator");
const {
  changePassword,
  getUserAccount,
  editUserAccount,
  deleteUserAccount,
  userCompletelyData,
} = require("../controller/account-controller");
const {
  editAccountValidationSchema,
  changePasswordValidationSchema,
  userCompletelyDataValidationSchema,
} = require("../validation/account-validator");

router.get("/", asyncHandler(protect), asyncHandler(getUserAccount));

router.patch(
  "/",
  asyncHandler(protect),
  validator(editAccountValidationSchema),
  asyncHandler(editUserAccount)
);

router.delete("/", asyncHandler(protect), asyncHandler(deleteUserAccount));

router.put(
  "/change-password",
  asyncHandler(protect),
  validator(changePasswordValidationSchema),
  asyncHandler(changePassword)
);

router.patch(
  "/complete-data",
  asyncHandler(protect),
  validator(userCompletelyDataValidationSchema),
  asyncHandler(userCompletelyData)
);
module.exports = router;
