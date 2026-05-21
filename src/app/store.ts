import {configureStore} from '@reduxjs/toolkit'
import productReducer from '../features/product/productSlice'
import userReducer from '../features/user/userSlice'  
import cartReducer from '../features/cart/cartSlice'
import authReducer  from '../features/auth/authSlice'
const store=configureStore({
    reducer:{
        products:productReducer,
        user:userReducer,
        cart:cartReducer,
        auth:authReducer 
    }
})
export default store;
// بتجيب نوع الـ return بتاعة function getState اللي بتستخدمها في الـ useSelector عشان تعرف نوع الـ state اللي بترجعها
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch