const router = require("express").Router();
const {
  renderLoginPage,
  renderProfilePage,
  renderAdminLoginPage,
  renderAdminProfilePage,
  renderSignUpPage,
} = require("../controller/view-controller");

router.get("/login", renderLoginPage);
router.get("/profile/:username", renderProfilePage);

router.get("/admin/login", renderAdminLoginPage);
router.get("/admin/profile/:username", renderAdminProfilePage);

router.get("/signup", renderSignUpPage);

module.exports = router;
