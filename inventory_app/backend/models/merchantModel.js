import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  shopName: { type: String, required: true },
  shopKey: { type: String, required: true, unique: true }, // Unique shop key for identification
});

const Merchant = mongoose.model("Merchant", merchantSchema);
export default Merchant;
