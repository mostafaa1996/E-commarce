const Store = require("../models/storeInfo");
exports.getContacts = async (req, res , next) => {
  try {
    const store = await Store.findOne();
    console.log(store);
    if(!store) return res.status(404).json({message:"Store not found"});
    res.status(200).json(store);
  } catch (err) {
    console.log(err);
    next(err);
  }
}