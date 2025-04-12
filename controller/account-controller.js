const User = require("../models/user-model");
const { AppError } = require("../utils/app-error");
const { getIranProvinces } = require("../utils/iran-provinces");

const getUserAccount = async (req, res, next) => {
  const { userId } = req.session;
  const user = await User.findById(userId).select(
    "_id firstname  lastname username email gender "
  );

  res.status(200).json({
    status: "success",
    data: { user },
  });
};

const editUserAccount = async (req, res, next) => {
  const { userId } = req.session;

  const {
    firstname = null,
    lastname = null,
    email = null,
    gender = null,
    username = null,
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
  user.email = email ?? user.email;
  user.gender = gender ?? user.gender;

  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    data: { user },
  });
};

const deleteUserAccount = async (req, res, next) => {
  const { userId } = req.session;

  await User.findByIdAndDelete(userId);

  req.session.destroy((err) => {
    if (!!err) return next(err);
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
};

const changePassword = async (req, res, next) => {
  const { userId } = req.session;
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(userId).select("+password");

  const isCurrentPasswordMatch = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordMatch) {
    return next(new AppError(400, "your current password is not match"));
  }

  user.password = newPassword;
  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    data: { user },
  });
};

const userCompletelyData = async (req, res, next) => {
  const { userId } = req.session;
  const user = await User.findById(userId).select("+password");

  const { dateOfBirth = null, phonenumber = [], province = null } = req.body;

  if (!!province && province !== "not-found") {
    const iranProvinces = await getIranProvinces();
    if (!iranProvinces.includes(province)) {
      return next(new AppError(409, "provide iran provinces"));
    }
  }

  const users = await User.find({
    _id: { $ne: user._id },
  });

  const checkPhoneNumberIsExist = users.some((user) =>
    user.phonenumber.some((phone) => phonenumber.includes(phone))
  );
  if (checkPhoneNumberIsExist) {
    return next(new AppError(409, "one of the phone numbers already exists"));
  }

  user.dateOfBirth = dateOfBirth ?? user.dateOfBirth;
  user.phonenumber = phonenumber.length ? phonenumber : user.phonenumber;
  user.province = province ?? user.province;

  await user.save({ validateModifiedOnly: true });

  res.status(200).json({ status: "success", data: { user } });
};

module.exports = {
  changePassword,
  getUserAccount,
  editUserAccount,
  deleteUserAccount,
  userCompletelyData,
};
