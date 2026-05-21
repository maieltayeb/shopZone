import { NavLink } from 'react-router-dom'
import { FiShoppingCart, FiUser,FiMenu, FiX } from 'react-icons/fi'
import  { useState, useEffect, useRef } from 'react'
import {  useDispatch } from 'react-redux'
import {useNavigate}from "react-router-dom"
import { deleteProductfromCart } from '../features/cart/cartSlice'
import { userLogout } from '../features/auth/authSlice'


import { auth } from "../firebase/config";
  import { useLocation } from 'react-router-dom'
import { sendEmailVerification } from 'firebase/auth';
import {getCurrentAuthUser} from '../features/auth/auth.service'
import { logout } from '../features/auth/auth.service'
import { useAppSelector } from '../hooks/useAppStore'
import type { CartItem } from '../features/cart/cart.types'
function Navbar() {


const CurrentAuthUser = getCurrentAuthUser();


const [isOpen,setIsOpen] = useState(false)
const [isCartOpen, setIsCartOpen] = useState(false)
const cartDropdownRef = useRef<HTMLDivElement>(null)
const selectedProductsOfCart=useAppSelector((state) => state.cart.items)
const dispatch = useDispatch()
const navigate= useNavigate()
  const user = useAppSelector((state) => state.auth.user);

  const menuRef = useRef<HTMLUListElement>(null)
const navLinks = [
  { path: '/', label: 'Home',protected: false  },

  { path: '/products', label: 'Products',protected: false  },

   { path: '/profile', label: 'Profile',protected: true },
 
]

  // Close cart dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        setIsCartOpen(false)
      }
    }

    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
      return () =>{ document.removeEventListener('mousedown', handleClickOutside)  
        document.removeEventListener('touchstart', handleClickOutside)
    }}
  }, [isCartOpen])

  // Calculate subtotal
  const subtotal = selectedProductsOfCart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0)

const toggleMenu = () => {
  setIsOpen(!isOpen);
}

const getactiveClass = ({ isActive }: { isActive: boolean }) =>
  `block w-full text-center px-4 py-2 transition ${
    isActive
      ? "text-gray-500 font-bold"
      : "text-gray-500 hover:text-blue hover:font-extrabold  active:bg-gray-300"
  }`;

   const handleLogout = async () => {
   
   await  logout();
    dispatch(userLogout());
    navigate("/login");
  };
//if user click outside mobile menu close it
  useEffect(() => {
  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  if (isOpen) {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }
}, [isOpen])
  return (
    <>
     {user && !user.emailVerified && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center justify-between">
          <p className="text-yellow-800 text-sm">
            ⚠️ Please verify your email to get full access.
          </p>
          <button
            onClick={() => sendEmailVerification(CurrentAuthUser!)}
            className="text-yellow-800 text-sm font-semibold underline hover:text-yellow-900"
          >
            Resend Email
          </button>
        </div>
      )}
    <nav className="bg-white shadow-md px-8 py-4 flex items-center justify-between">

      {/* Logo */}
      <NavLink to="/" className="text-2xl font-bold text-blue-600">
        ShopZone
      </NavLink>

      <ul className="hidden md:flex items-center gap-6 list-none ">
        {navLinks.filter(link => !link.protected || user).map((link) => (
          <li key={link.label}>
            <NavLink to={link.path} 
            
            className="text-gray-600 hover:text-blue-600">
              {link.label}
            </NavLink>
          </li>
        ))}

        {/* Cart Icon */}
        <li className='relative'>
          <button 
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative text-gray-600 hover:text-blue-600 transition focus:outline-none"
            title="Toggle cart"
          >
            <FiShoppingCart size={24} />
            {/* Product count badge */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {selectedProductsOfCart?.length || 0}
            </span>
          </button>

          {isCartOpen && (
            <div 
              ref={cartDropdownRef}
              className='absolute w-80 top-12 -right-16 bg-white text-black border border-gray-200 rounded-lg shadow-xl z-50'
            >
              {/* Header */}
              <div className='bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center rounded-t-lg'>
                <h3 className='font-bold text-gray-900'>Shopping Cart</h3>
                <span className='text-sm font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded'>
                  {selectedProductsOfCart?.length || 0} items
                </span>
              </div>

              {/* Cart Items */}
              <ul className='max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                {selectedProductsOfCart.length ? (
                  selectedProductsOfCart.map((item) => (
                    <li key={item.id} className='hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0'>
                      <div className='flex items-center justify-between p-3 gap-3'>
                        <img src={item.image} alt={item.title} className='w-12 h-12 object-cover rounded' />
                        
                        <div className='flex-1 min-w-0'>
                          <h4 className='line-clamp-1 font-medium text-gray-900 text-sm'>{item.title}</h4>
                          <div className='flex justify-between items-center mt-1'>
                            <span className='text-blue-600 font-bold text-sm'>${(item.price * item.quantity).toFixed(2)}</span>
                            <span className='text-xs text-gray-500'>Q: {item.quantity}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => dispatch(deleteProductfromCart(item.id))}
                          className='text-gray-400 hover:text-red-500 transition'
                          title='Remove'
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className='p-8 text-center'>
                    <FiShoppingCart size={40} className='mx-auto text-gray-300 mb-2' />
                    <p className='text-gray-500 font-medium'>Your cart is empty</p>
                    <p className='text-gray-400 text-sm mt-1'>Add items to get started</p>
                  </li>
                )}
              </ul>

              {/* Show more indicator */}
              {selectedProductsOfCart.length > 3 && (
                <div className='px-4 py-2 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500'>
                  Scroll to see all items
                </div>
              )}

              {/* Subtotal */}
              {selectedProductsOfCart.length > 0 && (
                <div className='px-4 py-3 border-t border-gray-200 bg-gray-50'>
                  <div className='flex justify-between mb-3'>
                    <span className='font-medium text-gray-700'>Subtotal:</span>
                    <span className='font-bold text-blue-600'>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className='space-y-2'>
                    <NavLink 
                      to="/cart" 
                      onClick={() => setIsCartOpen(false)}
                      className='block w-full text-center bg-gray-200 text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-300 transition text-sm'
                    >
                      View Cart
                    </NavLink>
                    <NavLink 
                      to="/checkout"
                      onClick={() => setIsCartOpen(false)}
                      className='block w-full text-center bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition text-sm'
                    >
                      Checkout
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
          )}
        </li>

        {/* Login */}
        {user?
          
            <li>
          <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <FiUser size={18} />
          logOut
          </button>
        </li>: (    <li>
          <NavLink to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <FiUser size={18} />
            Login/Register
          </NavLink>
        </li>)}
    
      </ul>
  <button className='md:hidden text-2xl' onClick={toggleMenu}>
    <FiMenu  />
  </button>
  {isOpen && (
    <ul ref={menuRef} className=' absolute top-16 left-0 w-full z-50 bg-blue-100 text-blue-300 border-2 border-gray-400 rounded-sm  flex flex-col items-center space-y-4 py-4 md:hidden'>
   { navLinks.filter(link => !link.protected || user).map((link)=>(
 <li key={link.label} className="w-full"><NavLink to={link.path} 
  onClick={() => setIsOpen(false)}
 className= {getactiveClass}>{link.label}</NavLink></li>
  
       )) 

          
   }
     <li>
          <NavLink to="/cart"  onClick={() => setIsOpen(false)} className="relative text-gray-600 hover:text-blue-600">
            <FiShoppingCart size={24} />
            {/* عدد المنتجات في العربية */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {selectedProductsOfCart?selectedProductsOfCart.length:0}
            </span>
          </NavLink>
        </li>
  
          {/* Login */}
        {user?
          
            <li>
          <button onClick={handleLogout}  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <FiUser size={18} />
          logOut
          </button>
        </li>: (    <li>
          <NavLink to="/register" onClick={() => setIsOpen(false)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <FiUser size={18} />
            Login/Register
          </NavLink>
        </li>)}
   </ul>
  )}

    </nav>
    </>
  )
}

export default Navbar



// {}

//   
//         </ul>