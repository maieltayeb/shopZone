import { useDispatch } from 'react-redux';
import {deleteProductfromCart, increaseProductQuantity, decreaseProductQuantity} from './cartSlice'
import { CartItem } from './cart.types';

interface CartProps {
  item: CartItem;
}
export default function Cart({item}: CartProps) {
  console.log(item)
const dispatch=useDispatch()

  const handelDelete=()=>{
    console.log(item);
    dispatch(deleteProductfromCart(item.id))
  }

  const handelDecreaseQuantity=()=>{
    dispatch(decreaseProductQuantity(item.id))
  }

  const handelIncreaseQuantity=()=>{
    dispatch(increaseProductQuantity(item.id))
  }

  return (
    <div className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition">
      
      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />

      <div className="flex-1 px-6">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
        <p className="text-blue-600 font-bold mt-1">${item.price.toFixed(2)}</p>

        <div className="flex items-center gap-3 mt-3 bg-gray-100 w-fit rounded-lg p-1">
          <button 
            onClick={handelDecreaseQuantity}
            className="px-3 py-1 text-gray-600 hover:text-red-600 hover:bg-white rounded transition font-bold"
            title="Decrease quantity"
          >
            −
          </button>
          <span className="px-3 py-1 font-semibold text-gray-900 min-w-8 text-center">{item.quantity}</span>
          <button 
            onClick={handelIncreaseQuantity}
            className="px-3 py-1 text-gray-600 hover:text-green-600 hover:bg-white rounded transition font-bold"
            title="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
        <p className="text-xs text-gray-500 mt-1">Total</p>
        <button 
          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded mt-2 transition text-sm font-medium" 
          onClick={handelDelete}
        >
          Remove
        </button>
      </div>
    </div>
  );
}