import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, match: [/\S+@\S+\.\S+/, 'Invalid email format'] },
  password: { type: String, required: true },
  phone: { type: String, trim: true },
  address: { type: String },
  shopKey: { type: String, required: true }, // Shop key to categorize workers
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true }, // Referencing Merchant model
  cartData: { type: Object, default: {} }, // Ensure workers have a cart if needed
  createdAt: { type: Date, default: Date.now },
});

const Worker = mongoose.model('Worker', workerSchema);
export default Worker;
