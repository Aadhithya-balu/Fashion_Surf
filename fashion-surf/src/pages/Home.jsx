import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Use VITE_API_URL if provided at build time, otherwise fall back to your deployed backend
const API_URL = import.meta.env.VITE_API_URL ?? 'https://fashion-surf-3.onrender.com';

const Home = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/products`);
                setProducts(response.data);
            } catch (err) {
                console.error('Failed to fetch products', err);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Latest Collections</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">Discover the latest trends in fashion. Premium quality, curated style, just for you.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <div key={product.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="relative aspect-[4/5] overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 shadow-sm">
                                {product.category}
                            </div>
                        </div>

                        <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                {product.name}
                            </h3>
                            <p className="text-2xl font-black text-indigo-600 mb-4">₹{product.price}</p>

                            <button
                                onClick={() => addToCart(product)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-indigo-600 transition-colors font-semibold"
                            >
                                <Plus className="w-5 h-5" />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
