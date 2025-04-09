const User = require("../models/user-model");
const { AppError } = require("../utils/app-error");
const { getIranProvinces } = require("../utils/iran-provinces");

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return next(new AppError(401, "username or password is not valid{username}"));
    }

    const isPasswordMatch = await user.comparePassword(password);
    console.log(isPasswordMatch);
    if (!isPasswordMatch) {
      return next(new AppError(401, "username or password is not valid {password}"));
    }

    req.session.userId = user._id;
    console.log(req.session);
    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    console.error("error in login", error);
    next(error);
  }
};

const checkSignUpData = async (req, res, next) => {
  try {
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
  } catch (error) {
    console.error("error in checkSignUpData", error);
    next(error);
  }
};

const signUp = async (req, res, next) => {
  try {
    //sanitization is remain
    const user = new User(req.body);
    await user.save();

    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    console.error("error in addUser", error);
    next(error);
  }
};

const checkUserCompletelyData = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        status: "fail",
        message: "You need to be logged in first",
      });
    }

    const { username } = req.params;
    const { phonenumber, province } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return next(new AppError(404, "provide valid username"));
    }

    if (req.session.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        status: "fail",
        data: { message: "at first you need to be logged in" },
      });
    }

    if (province && province !== "not-found") {
      const iranProvinces = await getIranProvinces();
      if (!iranProvinces.includes(province)) {
        return next(new AppError(409, "provide iran provinces"));
      }
    }

    const users = await User.find({});
    const checkPhoneNumberIsExist = users
      .filter((user) => user._id.toString() !== id)
      .some((user) => user.phonenumber.some((phone) => phonenumber.includes(phone)));

    if (checkPhoneNumberIsExist) {
      return next(new AppError(409, "one of the phone numbers already exists"));
    }

    next();
  } catch (error) {
    console.error("error in checkUserCompletelyData", error);
    next(error);
  }
};

const userCompletelyData = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    const { dateOfBirth = null, phonenumber = [] } = req.body;
    let { province = "not-set" } = req.body;

    if (province === "not-set") {
      province = null;
    }

    user.dateOfBirth = dateOfBirth ?? user.dateOfBirth;
    user.phonenumber = phonenumber.length ? phonenumber : user.phonenumber;
    user.province = province ?? user.province;

    await user.save({ validateModifiedOnly: true });

    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    console.error("error in userCompletelyData", error);
    next(error);
  }
};

const checkEditUserData = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        status: "fail",
        message: "You need to be logged in first",
      });
    }

    const { username } = req.params;
    const { username: editUsername, email: editEmail } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return next(new AppError(404, "provide valid username"));
    }

    // if (req.session.userId.toString() !== user._id.toString()) {
    //   return res.status(403).json({
    //     status: "fail",
    //     data: { message: "at first you need to be logged in" },
    //   });
    // }

    if (editUsername) {
      const usernameExists = await User.findOne({
        editUsername,
        _id: { $ne: user._id },
      });
      if (!!usernameExists) {
        return next(new AppError(409, "Username already exists"));
      }
    }

    if (editEmail) {
      const emailExists = await User.findOne({
        editEmail,
        _id: { $ne: user._id },
      });
      if (!!emailExists) {
        return next(new AppError(409, "Email already exists"));
      }
    }

    next();
  } catch (error) {
    console.error("error in checkEditUserData", error);
    next(error);
  }
};

const editUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const {
      firstname,
      lastname,
      gender,
      username: editUsername,
      email: editEmail,
    } = req.body;

    const user = await User.findOne({ username });

    user.firstname = firstname ?? user.firstname;
    user.lastname = lastname ?? user.lastname;
    user.gender = gender ?? user.gender;
    user.username = editUsername ?? user.username;
    user.email = editEmail ?? user.email;

    await user.save({ validateModifiedOnly: true });

    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    console.error("error in editUser", error);
    next(error);
  }
};

const editPassword = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        status: "fail",
        message: "You need to be logged in first",
      });
    }

    const { username } = req.params;
    const { lastPassword, newPassword } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return next(new AppError(404, "provide valid username"));
    }

    if (req.session.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        status: "fail",
        data: { message: "at first you need to be logged in" },
      });
    }
    if (lastPassword === newPassword) {
      return next(new AppError(400, "past password and new password are similar"));
    }

    const isLastPasswordMatch = await user.comparePassword(lastPassword);
    if (!isLastPasswordMatch) {
      return next(new AppError(401, "the last password is not valid"));
    }

    user.password = newPassword ?? user.password;

    await user.save({ validateModifiedOnly: true });

    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    console.error("error in editUser", error);
    next(error);
  }
};
const getUser = async (req, res, next) => {
  console.log(req.session.userId);
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      status: "fail",
      message: "You need to be logged in first",
    });
  }
  const { username } = req.params;

  const user = await User.findOne({ username }).select(
    "_id firstname  lastname username email gender "
  );
  if (!user) {
    return next(new AppError(404, "provide valid username"));
  }

  if (req.session.userId.toString() !== user._id.toString()) {
    return res.status(403).json({
      status: "fail",
      data: { message: "at first you need to be logged in" },
    });
  }
  res.status(200).json({
    status: "success",
    data: { user },
  });
};

const logout = async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      status: "fail",
      message: "You need to be logged in first",
    });
  }

  const { username } = req.params;

  const user = await User.findOne({ username });
  if (!user) {
    return next(new AppError(404, "provide valid username"));
  }

  if (req.session.userId.toString() !== user._id.toString()) {
    return res.status(403).json({
      status: "fail",
      data: { message: "at first you need to be logged in" },
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

module.exports = {
  login,
  signUp,
  checkSignUpData,
  checkUserCompletelyData,
  userCompletelyData,
  checkEditUserData,
  editUser,
  editPassword,
  getUser,
  logout,
};
