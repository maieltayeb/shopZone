import { lazy } from 'react'

const Products = lazy(() => import('./pages/products'));
const Home = lazy(() => import('./pages/Home'));
// const Register2 = lazy(() => import('./pages/Register3'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const Cart=lazy(()=>import('./pages/cart'))
const ProductDetails=lazy(()=>import('./pages/ProductDetails'))
const CheckOut=lazy(()=>import('./pages/CheckOut'))

import ForgotPassword from "./pages/forgetPassword"
import Register from "./pages/Register";
import AuthAction from "./pages/AuthenActions";
import ResetPassword from './pages/resetPassword';
// import Products from './pages/products'
// import Home from './pages/Home'
import Layout from './components/Layout'
// import Register from './pages/Register'
// import Login from './pages/Login'
// import Profile from './pages/Profile'
// import Cart from './pages/CheckOut'
import GuestRoute from './components/GuestRoute'
import PrivateRoute from './components/PrivateRoute'
import { Route,Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
const NotFound=lazy(()=>import('./pages/NotFound'))

import 'react-toastify/dist/ReactToastify.css';



function App() {
 
    
  return (
<>
<ToastContainer position="top-right" autoClose={3000} />
      <Routes>  
       <Route element={<Layout />}>
     <Route path='/' element={<Home/>} ></Route>
       <Route path="/auth/action" element={<AuthAction />} />
        {/* Auth Routes - requireAuth={false} means redirect if logged in */}
        <Route element={<GuestRoute />}>
        
          <Route path="/login" element={<Login />} />
          <Route path='/register' element={<Register/>}/>
        </Route>
       
          <Route path="/products" element={<Products />} />
        <Route path='/products/:id' element={<ProductDetails/>}></Route>

         <Route path='/cart' element={<Cart />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Protected Routes - requireAuth={true} (default) means redirect if NOT logged in */}
        <Route element={<PrivateRoute />}>
         <Route path="/profile" element={ <Profile />} />
           <Route path="/checkOut"  element={<CheckOut/>} ></Route>
     
        </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
</>
  )
}

export default App
