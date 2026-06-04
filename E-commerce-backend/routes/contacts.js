const express = require("express");
const router = express.Router();
const contactsController = require("../controllers/contacts");
const validator = require("../MiddleWare/isValid");
const { body } = require("express-validator");

const supportTicketValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .isLength({ max: 150 })
    .withMessage("Email must be 150 characters or less"),
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Subject must be between 3 and 150 characters"),
  body("messageType")
    .trim()
    .notEmpty()
    .withMessage("Message type is required")
    .isIn([
      "ORDER_ISSUE",
      "PAYMENT_ISSUE",
      "RETURN_REQUEST",
      "SHIPPING_DELAY",
      "PRODUCT_QUESTION",
      "OTHER",
    ])
    .withMessage("Invalid message type"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 5, max: 1000 })
    .withMessage("Message must be between 10 and 1000 characters"),
];

router.get("/", contactsController.getContacts);
router.post(
  "/",
  supportTicketValidation,
  validator,
  contactsController.createSupportTicket,
);

module.exports = router;
