
import { FaHeart, FaShare, FaTruck, FaSync, FaStar, FaHeadset } from 'react-icons/fa'
import {useParams} from 'react-router-dom'
import {getProductById} from '../services/api'
 import { useState ,useEffect} from 'react'  
import AddToCartButton from '../components/AddToCartButton'
import type { Product } from '../features/product/product.types'
export default function ProductDetails() {
    const { id } =useParams()


const [product,setProduct]=useState<Product | null>(null)
const [error,setError]=useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
useEffect(() => {
    if (!id) return
  const fetchProduct = async () => {
    try {
      const data = await getProductById(id)
      console.log(data);
      
      const product = {

   ...data,
  
    originalPrice: 299.99,
   
    rating: 4.5,
    reviews: 128,
    inStock: true,
       features: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Bluetooth 5.0 connectivity',
      'Premium comfort design',
      'Built-in microphone for calls'
    ]
  }
      setProduct(product)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    }
  }

  fetchProduct()
}, [id])


 
if (error) return <p>{error}</p>
if (!product) return <p>Loading...</p>
  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* product Image Section */}
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-200 max-h-500px object-cover rounded-lg"
          />
        </div>

        {/* product Info Section */}
        <div className="flex flex-col ">
          
          {/* Title and Rating */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.title}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={`text-lg ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-green-600">${product.price.toFixed(2)}</span>
              <span className="text-xl text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </span>
            </div>

            {/* Stock Status */}
            <p className={`text-lg font-semibold mb-6 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {product.inStock ? '✓ In Stock' : 'Out of Stock'}
            </p>

            {/* Description */}
            <p className="text-gray-700 text-base leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Features */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Key Features:</h3>
              <ul className="grid grid-cols-1 gap-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-700 flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-semibold">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
                >
                  −
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-12 text-center py-2 border-l border-r border-gray-300"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
         
<AddToCartButton  className="w-full text-lg " product={product}/>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200">
        
        {/* Free Shipping */}
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <FaTruck className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Free Shipping</h4>
            <p className="text-gray-600 text-sm">On orders over $50</p>
          </div>
        </div>

        {/* Easy Returns */}
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-lg">
            <FaSync className="text-green-600 text-2xl" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Easy Returns</h4>
            <p className="text-gray-600 text-sm">30-day return policy</p>
          </div>
        </div>

        {/* Customer Support */}
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 p-4 rounded-lg">
            <FaHeadset className="text-purple-600 text-2xl" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">24/7 Support</h4>
            <p className="text-gray-600 text-sm">Dedicated customer service</p>
          </div>
        </div>
      </div>
    </div>
  )
}



            {/* Wishlist and Share */}
            // <div className="flex gap-4">
            //   <button
            //     onClick={() => setIsFavorite(!isFavorite)}
            //     className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition ${
            //       isFavorite 
            //         ? 'border-red-500 bg-red-50 text-red-600' 
            //         : 'border-gray-300 text-gray-600 hover:border-red-500'
            //     }`}
            //   >
            //     <FaHeart className={isFavorite ? 'fill-current' : ''} />
            //     Wishlist
            //   </button>
            //   <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-blue-600 transition">
            //     <FaShare />
            //     Share
            //   </button>
            // </div>