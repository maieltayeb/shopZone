import { useState, useEffect } from 'react';
import {useSelector} from 'react-redux'
import { useAppSelector } from '../hooks/useAppStore';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { AddressFormData } from '../types/forms.types';
import type { Address } from '../features/user/user.types';

const CheckOut = () => {
  const navigate = useNavigate();
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  const {
    register,
    handleSubmit: handleAddressSubmit,
    formState: { isSubmitting, errors },
    reset: resetAddressForm,
  } = useForm<AddressFormData>({
    defaultValues: {
      label: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      isDefault: false,
    },
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    paymentMethod: 'card'
  });

  // Load addresses from Firebase
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        const addressesData = userDoc.data()?.addresses || [];
        setSavedAddresses(addressesData);

        // Auto-select default address
        const defaultAddress = addressesData.find((addr: Address) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          handleAddressSelect(defaultAddress.id, addressesData);
        }
      } catch (error) {
        console.error("Error loading addresses:", error);
      }
    };

    loadAddresses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressSelect = (addressId: string, addresses?: Address[]) => {
    setSelectedAddressId(addressId);
    const addrs = addresses || savedAddresses;
    const selected = addrs.find(addr => addr.id === addressId);
    if (selected) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: selected.street,
        city: selected.city,
        state: selected.state,
        zip: selected.zip,
        country: selected.country,
        paymentMethod: formData.paymentMethod
      });
    }
  };

  const onAddressSubmit = async (data: AddressFormData) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const newAddress: Address = {
        id: Date.now().toString(),
        ...data,
        isDefault: savedAddresses.length === 0 || data.isDefault,
      };

      let updatedAddresses = data.isDefault
        ? savedAddresses.map((addr) => ({ ...addr, isDefault: false }))
        : savedAddresses;
      updatedAddresses = [...updatedAddresses, newAddress];

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { addresses: updatedAddresses });

      setSavedAddresses(updatedAddresses);
      setSelectedAddressId(newAddress.id);
      handleAddressSelect(newAddress.id, updatedAddresses);
      resetAddressForm();
      setIsAddingNewAddress(false);
      toast.success("✅ تم إضافة العنوان بنجاح");
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("❌ حدث خطأ أثناء إضافة العنوان");
    }
  };

  const handleAddNewAddress = () => {
    setIsAddingNewAddress(true);
    resetAddressForm();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Order placed:', formData);
  };

  // Sample cart items for display
 
const cartSelectedItems=useAppSelector((state)=>state.cart.items)
  const subtotal = cartSelectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
   const shipping = subtotal > 50 ? 0 : 10
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 text-sm">1</span>
                Shipping Address
              </h2>

              {/* Saved Addresses Selection */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-4">Select from saved addresses:</p>
                  <div className="space-y-3 mb-6">
                    {savedAddresses.map(address => (
                      <label key={address.id} className="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                        <input
                          type="radio"
                          name="savedAddress"
                          value={address.id}
                          checked={selectedAddressId === address.id}
                          onChange={() => handleAddressSelect(address.id)}
                          className="mt-1 w-4 h-4"
                        />
                        <div className="ml-4 flex-1">
                          <p className="font-semibold text-gray-900">{address.label}</p>
                          <p className="text-sm text-gray-600">{address.street}</p>
                          <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zip}</p>
                          {address.isDefault && (
                            <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Default Address</span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddNewAddress}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-700 font-medium hover:border-blue-500 hover:text-blue-600 transition"
                  >
                    + Add New Address
                  </button>
                </div>

                {/* Add New Address Form */}
                {isAddingNewAddress && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Add New Address</h3>
                      <button
                        type="button"
                        onClick={() => setIsAddingNewAddress(false)}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleAddressSubmit(onAddressSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            placeholder="Label (e.g., Home, Office)"
                            {...register("label", { required: "Label is required" })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label.message}</p>}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Street Address"
                            {...register("street", { required: "Street is required" })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="City"
                            {...register("city", { required: "City is required" })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="State"
                            {...register("state", { required: "State is required" })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="ZIP Code"
                            {...register("zip", { required: "ZIP is required" })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip.message}</p>}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Country"
                            {...register("country", { required: "Country is required" })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          {...register("isDefault")}
                          className="w-4 h-4 rounded border-gray-300"
                          id="setDefault"
                        />
                        <label htmlFor="setDefault" className="text-sm text-gray-700">
                          Set as default address
                        </label>
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
                        >
                          {isSubmitting ? "Saving..." : "Save Address"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingNewAddress(false)}
                          className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 text-sm">2</span>
                Payment Method
              </h2>
              
              <div className="space-y-4">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 text-lg font-medium text-gray-700">Credit/Debit Card</span>
                </label>

                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4 mt-4 pl-4 border-l-2 border-blue-500">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 text-lg font-medium text-gray-700">PayPal</span>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={formData.paymentMethod === 'bank'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 text-lg font-medium text-gray-700">Bank Transfer</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-8 sticky top-20">
                 
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
          
              {/* Cart Items */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                {cartSelectedItems?.map(item => (
                  <div key={item.id} className="space-y-1">
                    <p className="font-semibold text-gray-900 text-sm line-clamp-2">{item.title || item.title}</p>
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="text-xs text-gray-500">
                        ${(item.price || item.price).toFixed(2)} × {item.quantity}
                      </span>
                      <span className="font-bold text-gray-900">${((item.price || item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
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
                  <span>${shipping.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-200"
              >
                Place Order
              </button>

              {/* Continue Shopping */}
              <button
                className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-bold text-lg mt-3 hover:bg-gray-200 transition duration-200"
              >
                Continue Shopping
              </button>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  Secure checkout
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  Money-back guarantee
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  Free shipping on orders $50+
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
