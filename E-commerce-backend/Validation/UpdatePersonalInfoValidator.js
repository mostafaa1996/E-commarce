const { body } = require("express-validator");
exports.ValidatePersonalInfo = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters"),

  body("email").isEmail().withMessage("Invalid email address"),

  body("phone").isMobilePhone().withMessage("Invalid phone number"),

  body("dateOfBirth").isISO8601().withMessage("Invalid date format"),

  body("gender")
    .trim()
    .toLowerCase()
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ min: 2 })
    .withMessage("Location must be at least 2 characters"),
];
