import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      default: () => `SKU-${Date.now()}`,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Please add a quantity"],
      min: [0, "Quantity cannot be negative"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    shopKey: {
      type: String,
      required: [true, "Please add a shopKey"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ user: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ shopKey: 1 }); // Adding an index for shopKey

const Product = mongoose.model("Product", productSchema);

export default Product;
