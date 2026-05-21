import React from 'react'
import Cart from './cart'
import { useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../../app/store'
import type { CartItem } from '../../types'


export default function Cartlist() {

    const selectedProducts: CartItem[] = useSelector((state: RootState) => state.cart.items)
    const navigate = useNavigate()
     console.log(selectedProducts);

    // Calculate totals
    const subtotal: number = selectedProducts.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * 0.1
    const shipping = subtotal > 50 ? 0 : 10
    const total = subtotal + tax + shipping

    const handleCheckout = () => {
      navigate('/checkout')
    }
    
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            {selectedProducts?.length > 0 ? (
              selectedProducts.map((pro) => <Cart item={pro} key={pro.id} />)
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                <button 
                  onClick={() => navigate('/products')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-8 sticky top-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedProducts?.length === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-bold text-lg mt-3 hover:bg-gray-200 transition duration-200"
              >
                Continue Shopping
              </button>

              {shipping === 0 && (
                <div className="mt-6 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">✓ Free shipping on this order!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
