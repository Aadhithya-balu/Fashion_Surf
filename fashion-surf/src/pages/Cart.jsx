import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleCheckout = () => {
        if (!token) {
            navigate('/login');
            return;
        }
        navigate('/payment');
    };

    if (cart.length === 0) {
        return (
            <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto text-center">
                <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm max-w-lg mx-auto">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2"> Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Ready to find some great fashion? Start shopping now!</p>
                    <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                        Go Shopping
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-12">Your Shopping Bag</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="w-32 h-40 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-2">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                                    <p className="text-gray-500 font-medium">Qty: {item.quantity}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-2xl font-black text-indigo-600">₹{item.price * item.quantity}</p>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg sticky top-28">
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Summary</h2>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Subtotal</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Shipping</span>
                                <span className="text-green-600">FREE</span>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-between">
                                <span className="text-xl font-bold text-gray-900">Total</span>
                                <span className="text-3xl font-black text-indigo-600">₹{cartTotal}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                        >
                            Checkout Now
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
