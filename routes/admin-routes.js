const router = require("express").Router();
const {
  login,
  getAllUsers,
  logout,
  promoteUserToManager,
  deleteUserByAdmin,
} = require("../controller/admin-controller");
router.post("/login", login);
router.get("/getUsers/:username", getAllUsers);
router.patch("/promote/:adminUsername", promoteUserToManager);
router.delete("/delete/:adminUsername", deleteUserByAdmin);
router.get("/logout", logout);

module.exports = router;
