const { Schema, model } = require("mongoose");
const { isDate, isEmail, isMobilePhone, isNumeric } = require("validator");
const { getIranProvinces } = require("../utils/iran-provinces");
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      minlength: [3, "firstname must be atleast 3 charector"],
      maxlength: [30, "firstname must be maximum 30 charector"],
      required: [true, "firstname is required"],
      trim: true,
    },
    lastname: {
      type: String,
      minlength: [3, "lastname must be atleast 3 charector"],
      maxlength: [30, "lastname must be maximum 30 charector"],
      required: [true, "lastname is required"],
      trim: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "not-set"],
        message: "gender is eather male or female",
      },
      default: "not-set",
      trim: true,
    },

    username: {
      type: String,
      minlength: [3, "username must be at least 3 characters"],
      maxlength: [30, "username must be at most 30 characters"],
      unique: true,
      required: [true, "username is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      validate: { validator: (value) => isEmail(value) },
      trim: true,
    },
    password: {
      type: String,
      minlength: [8, "password must be at least 8 charector"],
      validate: {
        validator: (pass) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pass),
        message: "password must be have atleast one char or one number",
      },
      required: [true, "password is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: ["employee", "manager"],
        message: "role is eather employee or manager",
      },
      default: "employee",
      trim: true,
      lowercase: true,
    },

    //users completly datas
    dateOfBirth: {
      type: Date,
      validate: {
        validator: (value) => {
          if (!!value) {
            isDate(value);
          }
        },
        message: "Invalid date format",
      },
      default: null,
    },
    phonenumber: {
      type: [String],
      validate: {
        validator: (value) => {
          if (value === "not-set") return true;

          if (value.length) {
            return value.every((phone) => isMobilePhone(phone, "fa-IR"));
          }
        },
        message: "Provide a valid phone number and at least one phone number",
      },
      default: [],
    },

    province: {
      type: String,
      validate: async (value) => {
        try {
          if (value === "not-set") return true;

          const provinces = await getIranProvinces();
          return provinces.includes(value);
        } catch (err) {
          throw err;
        }
      },
      trim: true,
      default: "not-set",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = model("User", UserSchema);
