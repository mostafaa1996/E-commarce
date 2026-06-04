const Store = require("../models/storeInfo");
const ContactMessage = require("../models/contactMessage");

const issuesPriority = [
  { type: "ORDER_ISSUE", priority: "HIGH" },
  { type: "PAYMENT_ISSUE", priority: "URGENT" },
  { type: "RETURN_REQUEST", priority: "NORMAL" },
  { type: "SHIPPING_DELAY", priority: "NORMAL" },
  { type: "PRODUCT_QUESTION", priority: "LOW" },
  { type: "OTHER", priority: "LOW" },
];
exports.getContacts = async (req, res, next) => {
  try {
    const store = await Store.findOne();
    const issuesCategory = [
      "ORDER_ISSUE",
      "PAYMENT_ISSUE",
      "RETURN_REQUEST",
      "SHIPPING_DELAY",
      "PRODUCT_QUESTION",
      "OTHER",
    ];
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.status(200).json({ store, issuesCategory });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.createSupportTicket = async (req, res, next) => {
  try {
    const { name, email, phone, subject, messageType, order, message } =
      req.body;

    const fullName = name?.trim() || "";
    const orderNumber = order?.trim() || "";

    const issuePriority = issuesPriority.find(
      (issue) => issue.type === messageType,
    );

    if (!issuePriority) {
      return res.status(400).json({
        success: false,
        message: "Invalid message type.",
      });
    }

    const priority = issuePriority.priority || "LOW";

    const contactMessage = await ContactMessage.create({
      user: req.user?._id || null,
      fullName,
      email,
      phone,
      orderNumber,
      subject,
      message,
      priority,
      status : "NEW",
    });

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send your message.",
    });
  }
};
