import React, { useContext } from 'react';
import './Product.css';
import { StoreContext } from '../../Context/StoreContext';

const Product = ({ name, price, desc, id }) => {
    const { cartItems, addToCart, removeFromCart, currency } = useContext(StoreContext);

    return (
        <div className='product-item'>
            <div className="product-item-info">
                <div className="product-item-name">
                    <p>{name}</p>
                </div>
                <p className="product-item-desc">{desc}</p>
                <p className="product-item-price">{currency}{price}</p>
            </div>
            <div className="product-item-actions">
                {!cartItems[id] ? (
                    <button className='add-button' onClick={() => addToCart(id)}>Add to Cart</button>
                ) : (
                    <div className="product-item-counter">
                        <button onClick={() => removeFromCart(id)}>-</button>
                        <p>{cartItems[id]}</p>
                        <button onClick={() => addToCart(id)}>+</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Product;
