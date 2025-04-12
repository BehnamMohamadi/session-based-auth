const User = require("../models/user-model");
const { AppError } = require("../utils/app-error");
const { asyncHandler } = require("../utils/async-handler");

const login = async (req, res, next) => {
  const { userId = null } = req.session;
  if (!!userId) {
    return next(new AppError(400, "session already exists, you need logout first"));
  }

  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return next(new AppError(401, "username or password is not valid{username}"));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new AppError(401, "username or password is not valid {password}"));
  }

  req.session.userId = user._id;
  console.log(req.session);
  console.log("donenn");
  res.status(200).json({ status: "success", data: { user } });
};

const checkSignUpData = async (req, res, next) => {
  const { username, email } = req.body;

  const usernameExists = await User.exists({ username });
  if (!!usernameExists) {
    return next(new AppError(409, "this username is already exist"));
  }

  const emailExists = await User.exists({ email });
  if (!!emailExists) {
    return next(new AppError(409, "this email is already exist"));
  }

  next();
};

const signup = async (req, res, next) => {
  const { firstname, lastname, gender, username, email, password } = req.body;
  const user = await User.create({
    firstname,
    lastname,
    gender,
    username,
    password,
    email,
    role: "employee",
  });

  res.status(201).json({
    status: "success",
    data: { user },
  });
};

const protect = async (req, res, next) => {
  const { userId } = req.session;
  console.log(req.session);
  if (!userId) {
    return next(new AppError(401, "you are not logged in, please login first"));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError(401, "the user blonging to this session no longer exists"));
  }

  next();
};

const restrictTo = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    const { userId } = req.session;
    const { role } = await User.findById(userId);

    if (!roles.includes(role)) {
      return next(new AppError(403, "you do not have permission to perform this action"));
    }

    next();
  });
};

const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (!!err) return next(err);
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
};

module.exports = {
  login,
  signup,
  checkSignUpData,
  logout,
  protect,
  restrictTo,
};
