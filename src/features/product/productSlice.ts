import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import {ProductState, type Product} from "./product.types"; 
const initialState: ProductState = {
  items: [] ,
  loading: false,
  error: null
};   
 export  const productSlice=createSlice({
name:"products",
initialState   
,
reducers:{
    getProducts:(state,action:PayloadAction<Product[]>)=>{
          state.items = action.payload
    },
//     addProduct:(state,action)=>{
//         state.push(action.payload)
//     },
//     removeProduct:(state,action)=>{
//         return state.filter(product=>product.id!==action.payload)  
//   },
// updateProduct:(state,action)=>{
//     const index=state.findIndex(product=>product.id===action.payload.id)
//     if(index!==-1){
//         state[index]=action.payload
//     }
// }
}   
 })

 export const {getProducts}=productSlice.actions
 export default productSlice.reducer