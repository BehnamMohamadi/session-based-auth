//admin controllers

const User = require("../models/user-model");
const { AppError } = require("../utils/app-error");

const getUserById = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError(404, `user (id: ${userId}) not found`));
  }

  res.status(200).json({
    status: "success",
    data: { user },
  });
};

const getAllUsers = async (req, res, next) => {
  const users = await User.find({}).select(
    "_id firstname  lastname username email gender role createdAt"
  );

  res.status(200).json({
    status: "success",
    data: { users },
  });
};

const addUser = async (req, res, next) => {
  const {
    firstname = null,
    lastname = null,
    gender = null,
    username = null,
    password = null,
    email = null,
    role = "user",
  } = req.body;

  const duplicateUsername = await User.findOne({ username });
  if (!!duplicateUsername) {
    return next(
      new AppError(409, "username is already exists, use a different username")
    );
  }

  const duplicateEmail = await User.findOne({
    email,
    _id: { $ne: user._id },
  });
  if (!!duplicateEmail) {
    return next(new AppError(409, "email is already exists, use a different email"));
  }

  const user = await User.create({
    firstname,
    lastname,
    username,
    password,
    gender,
    email,
    role,
  });

  res.status(201).json({
    status: "success",
    data: { user },
  });
};

const editUserById = async (req, res, next) => {
  const { userId } = req.params;

  const {
    firstname = null,
    lastname = null,
    gender = null,
    username = null,
    email = null,
    role = "user",
  } = req.body;

  const user = await User.findById(userId);

  const duplicateUsername = await User.findOne({
    username,
    _id: { $ne: user._id },
  });
  if (!!duplicateUsername) {
    return next(
      new AppError(409, "username is already exists, use a different username")
    );
  }

  const duplicateEmail = await User.findOne({
    email,
    _id: { $ne: user._id },
  });
  if (!!duplicateEmail) {
    return next(new AppError(409, "email is already exists, use a different email"));
  }

  user.firstname = firstname ?? user.firstname;
  user.lastname = lastname ?? user.lastname;
  user.username = username ?? user.username;
  user.gender = gender ?? user.gender;
  user.email = email ?? user.email;
  user.role = role ?? user.role;

  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    data: { user },
  });
};

const deleteUserById = async (req, res, next) => {
  const { userId } = req.params;

  await User.findByIdAndDelete(userId);

  if (!!req.session) {
    req.session.destroy((err) => {
      if (!!err) return next(err);
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

const promoteUserToManager = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError(409, `user with id${userId} not-found`));
  }

  if (user.role === "manager") {
    return next(new AppError(400, "user is already a manager"));
  }

  user.role = "manager";
  await user.save({ validateModifiedOnly: true });

  res.status(204).json({ status: "success", data: { message: "role has been changed" } });
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  editUserById,
  deleteUserById,
  promoteUserToManager,
};
