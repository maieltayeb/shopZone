import { useDispatch } from 'react-redux';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { addProductToCart } from '../features/cart/cartSlice';
import { Product } from '../features/product/product.types';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}
export default function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const dispatch = useDispatch();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    //  console.log("from add to card",product);
   e.stopPropagation();  
    dispatch(
      addProductToCart(product)
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition ${className}`}
    >
      <AiOutlineShoppingCart size={18} />
      <span>Add to Cart</span>
    </button>
  );
}
