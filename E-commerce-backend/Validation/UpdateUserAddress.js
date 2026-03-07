const { body } = require("express-validator");
exports.ValidateUserAddress = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("name must be at least 2 characters"),

  body("street")
    .trim()
    .notEmpty()
    .withMessage("Street is required")
    .isLength({ min: 10 })
    .withMessage("First name must be at least 10 characters"),

  body("label")
    .trim()
    .notEmpty()
    .withMessage("Label is required")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters"),

  body("email").isEmail().withMessage("Invalid email address"),

  body("phone").isMobilePhone().withMessage("Invalid phone number"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("city and state is required")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("city and state is required")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters"),

  body("country")
    .trim()
    .notEmpty()
    .withMessage("country is required")
    .isLength({ min: 3 })
    .withMessage("Location must be at least 2 characters"),

  body("zipCode")
    .trim()
    .notEmpty()
    .withMessage("zipCode is required")
    .isLength({ min: 3 })
    .withMessage("zipCode must be at least 3 characters"),
];
