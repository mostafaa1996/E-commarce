module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) return res.redirect("/login"); 
    next();
};
  
module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) return res.redirect("/login");
  if (req.session.user.role !== "admin") return res.status(403).send("Access denied");
  next();
};