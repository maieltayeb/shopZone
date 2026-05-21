// import {useState} from 'react'

// export default function ProductCard({ product }) {
//   const [showMore, setShowMore] = useState(false);
//   return (
//     <div className='bg-white h-full shadow-md rounded-lg p-4'>
        
//         <img src={product.image} alt={product.title} className="w-full h-40 object-cover rounded-lg mb-4" />
//         <h2 className="text-xl font-semibold mb-2 h-14 line-clamp-2"   title={product.title} >{product.title}</h2>
//         <p className="text-gray-700 mb-4 h-16  line-clamp-4 flex-grow">  {showMore
//     ? product.description
//     : product.description.slice(0, 80) + "..."}<button onClick={() => setShowMore(!showMore)} className="text-blue-600 hover:underline">
//           {showMore ? "Show Less" : "Show More"}
//         </button></p>   
//         <div className="flex items-center justify-between mt-auto">
//             <span className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</span>
//             <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add to Cart</button>
//         </div>
//     </div>
//   )
// }
import { useState } from 'react'
import AddToCartButton from './AddToCartButton'
import { useNavigate } from 'react-router-dom';
import type { Product } from '../features/product/product.types';
export default function ProductCard({ product }:{ product: Product}) {
  const navigate=useNavigate()
  const [showMore, setShowMore] = useState(false);
  const isLong = product.description.length > 80;

  return (
    <div     onClick={() => navigate(`/products/${product.id}`)}
      style={{ cursor: "pointer" }} className='bg-white h-full shadow-md rounded-lg p-4 flex flex-col'>
      <img src={product.image} alt={product.title} className="w-full h-40 object-cover rounded-lg mb-4" />
      
      <h2 className="text-xl font-semibold mb-2 h-14 overflow-hidden line-clamp-2" title={product.title}>
        {product.title}
      </h2>

      <div className="h-16 overflow-hidden mb-1">
        <p className="text-gray-700 text-sm leading-5">
          {product.description}
        </p>
      </div>

      {isLong && (
        <button 
          onClick={() => setShowMore(true)} 
          className="text-blue-600 text-sm hover:underline text-left mb-4"
        >
          Show More
        </button>
      )}

      <div className="flex items-center justify-between mt-auto">
        <span className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</span>
        <AddToCartButton  product={product}/>
     
      </div>

      {showMore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowMore(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <button onClick={() => setShowMore(false)} className="text-gray-400 text-2xl leading-none ml-4">×</button>
            </div>
            <p className="text-gray-700">{product.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}
