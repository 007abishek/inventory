import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
    WorkerId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    customerDetails: { type: Object, required: true },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false }
});

const salesModel = mongoose.models.sales || mongoose.model("sales", salesSchema);
export default salesModel;
