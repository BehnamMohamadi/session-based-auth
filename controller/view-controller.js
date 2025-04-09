const path = require("node:path");
const User = require("../models/user-model");
const { AppError } = require("../utils/app-error");

const renderLoginPage = (req, res, next) => {
  res.render(path.join(__dirname, "../views/login.ejs"));
};

const renderProfilePage = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select(
      "_id firstname  lastname username email gender createdAt"
    );
    if (!user) return res.redirect("http://localhost:8000/login");

    res.render(path.join(__dirname, "../views/profile.ejs"), { user });
  } catch (error) {
    console.error("Profile render error:", error);
    res.status(500).redirect("/login");
  }
};

const renderAdminLoginPage = (req, res, next) => {
  res.render(path.join(__dirname, "../views/admin-login.ejs"));
};

const renderAdminProfilePage = async (req, res, next) => {
  try {
    const { username } = req.params;
    console.log(username);
    const user = await User.findOne({ username }).select(
      "_id firstname  lastname username email gender role createdAt"
    );
    if (!user) return res.redirect("http://127.0.0.1:8000/admin/login");
    console.log(user);
    if (user.role !== "manager") {
      return next(
        new AppError(
          401,
          "username or password is not valid{just admin can use this page}"
        )
      );
    }

    res.render(path.join(__dirname, "../views/admin-profile.ejs"), { user });
  } catch (error) {
    console.error("Profile render error:", error);
    res.status(500).redirect("http://127.0.0.1:8000/admin/login");
  }
};

const renderSignUpPage = (req, res, next) => {
  res.render(path.join(__dirname, "../views/signup.ejs"));
};

module.exports = {
  renderLoginPage,
  renderProfilePage,
  renderAdminLoginPage,
  renderAdminProfilePage,
  renderSignUpPage,
};
