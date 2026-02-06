const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

//in case of session used
// module.exports = (req, res, next) => {
//     if (!req.session.isLoggedIn) return res.redirect("/login"); 
//     next();
// };
  
// module.exports = (req, res, next) => {
//   if (!req.session.isLoggedIn) return res.redirect("/login");
//   if (req.session.user.role !== "admin") return res.status(403).send("Access denied");
//   next();
// };