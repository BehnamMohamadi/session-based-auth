const User = require("../models/user-model");
const { AppError } = require("../utils/app-error");

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

    if (user.role !== "manager") {
      return next(
        new AppError(
          401,
          "username or password is not valid{just admin can use this page}"
        )
      );
    }

    req.session.userId = user._id;
    console.log(req.session);

    res
      .status(200)
      .json({ status: "success", data: { user, message: "logged in successfully" } });
  } catch (error) {
    console.error("error in admin-controller.js>>login", error);
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user || user.role !== "manager") {
      return next(new AppError(401, "Only admin can access this resource"));
    }
    const users = await User.find({}).select(
      "_id firstname  lastname username email gender role createdAt"
    );

    res.status(200).json({
      status: "success",
      data: { users },
    });
  } catch (error) {
    console.error("error in admin-controller.js>>getAllUsers", error);
    next(error);
  }
};

const promoteUserToManager = async (req, res, next) => {
  try {
    const { adminUsername } = req.params;
    const { userId } = req.body;

    const adminUser = await User.findOne({ username: adminUsername });

    if (!adminUser || adminUser.role !== "manager") {
      return next(new AppError(401, "Only admin can access this resource"));
    }

    const userToPromote = await User.findById(userId);
    if (!userToPromote) {
      return next(new AppError(401, `user with id${userId} not-found`));
    }

    if (userToPromote.role === "manager") {
      return next(new AppError(400, "user is already a manager"));
    }

    userToPromote.role = "manager";
    await userToPromote.save({ validateModifiedOnly: true });

    res
      .status(201)
      .json({ status: "success", data: { message: "role has been changed" } });
  } catch (error) {
    console.error("error in admin-controller.js>>promoteUserToManager", error);
    next(error);
  }
};

const deleteUserByAdmin = async (req, res, next) => {
  try {
    const { adminUsername } = req.params;
    const { userId } = req.body;

    const adminUser = await User.findOne({ username: adminUsername });
    console.log(adminUser);
    if (!adminUser || adminUser.role !== "manager") {
      return next(new AppError(403, "Only admin can access this resource"));
    }

    if (adminUser._id.toString() === userId) {
      return next(new AppError(400, "Admin cannot delete his/her acount"));
    }

    const userToDelete = await User.findByIdAndDelete(userId);

    if (!userToDelete) {
      return next(new AppError(404, `User with id ${userId} not found`));
    }

    res.status(200).json({
      status: "success",
      data: { userToDelete },
    });
  } catch (error) {
    console.error("Error in deleteUserByAdmin:", error);
    next(error);
  }
};

const logout = (req, res, next) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};

module.exports = {
  login,
  getAllUsers,
  promoteUserToManager,
  logout,
  deleteUserByAdmin,
};
