import Customer from "../models/workerModel.js";

// Add item to cart
const addToCart = async (req, res) => {
  try {
     const { itemIds } = req.body; // Expecting an array of item IDs
     const customer = await Customer.findById(req.user.id);

     if (!customer) return res.status(404).json({ success: false, message: "User not found" });

     let cartData = customer.cartData || {};

     itemIds.forEach((itemId) => {
        cartData[itemId] = (cartData[itemId] || 0) + 1;
     });

     await Customer.findByIdAndUpdate(req.user.id, { cartData });
     res.json({ success: true, message: "Items added to cart", cartData });
  } catch (error) {
     console.error(error);
     res.status(500).json({ success: false, message: "Error adding items to cart" });
  }
};


// Remove item from cart
const removeFromCart = async (req, res) => {
   try {
      const { itemId } = req.body;
      const customer = await Customer.findById(req.user.id);

      if (!customer) return res.status(404).json({ success: false, message: "User not found" });

      let cartData = customer.cartData || {};

      if (cartData[itemId]) {
         cartData[itemId] -= 1;
         if (cartData[itemId] === 0) delete cartData[itemId];
      }

      await Customer.findByIdAndUpdate(req.user.id, { cartData });
      res.json({ success: true, message: "Removed from cart", cartData });
   } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error removing from cart" });
   }
};

// Get user cart
const getCart = async (req, res) => {
   try {
      const customer = await Customer.findById(req.user.id);
      if (!customer) return res.status(404).json({ success: false, message: "User not found" });

      res.json({ success: true, cartData: customer.cartData || {} });
   } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error fetching cart" });
   }
};

export { addToCart, removeFromCart, getCart };
