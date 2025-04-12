const User = require("../models/user-model");
const { asyncHandler } = require("./async-handler");

const addAdmin = asyncHandler(async () => {
  const isManagerExists = await User.findOne({ role: "manager" });
  if (isManagerExists) {
    return console.info("[i] manager already exists");
  }

  await User.create({
    firstname: process.env.ADMIN_FIRSTNAME,
    lastname: process.env.ADMIN_LASTNAME,
    username: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    gender: "male",
    role: "manager",
  });

  return console.log("[+] manager added successfully");
});

module.exports = { addAdmin };
