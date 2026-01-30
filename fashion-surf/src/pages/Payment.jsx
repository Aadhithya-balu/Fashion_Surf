import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Payment = () => {
    const { cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handlePayment = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate payment process
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            clearCart();
            setTimeout(() => {
                navigate('/');
            }, 3000);
        }, 2000);
    };

    if (success) {
        return (
            <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto text-center">
                <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm max-w-lg mx-auto">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Successful!</h2>
                    <p className="text-gray-500 mb-8">Thank you for your purchase. Redirecting you home...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <div className="max-w-xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Final Step</h1>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative">
                    <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
                                <p className="text-sm font-medium text-gray-500">Secure encrypted transaction</p>
                            </div>
                        </div>
                        <ShieldCheck className="w-10 h-10 text-green-500" />
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Card Holder</label>
                                <input type="text" className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none text-gray-900" placeholder="John Doe" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Card Number</label>
                                <input type="text" className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none text-gray-900" placeholder="•••• •••• •••• ••••" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Expiry</label>
                                    <input type="text" className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none text-gray-900" placeholder="MM/YY" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">CVC</label>
                                    <input type="text" className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl transition-all outline-none text-gray-900" placeholder="•••" required />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 mt-8">
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-lg font-bold text-gray-500">Total Amount</span>
                                <span className="text-4xl font-black text-indigo-600">₹{cartTotal}</span>
                            </div>
                            <button
                                disabled={loading}
                                className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-100 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : `Pay ₹${cartTotal}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Payment;
