import { createSlice,PayloadAction  } from "@reduxjs/toolkit";

import { CartState} from "./cart.types";
import { Product } from "../product/product.types";

const initialState: CartState = {
  items: [],
};
 export  const cartSlice=createSlice({
name:"cartOfSelectedProducts",
initialState,

     reducers:{
       
      addProductToCart:(state,action: PayloadAction<Product>)=>{
   const item=state.items.find((item)=>item.id===action.payload.id)
  
   
     if(item){
        item.quantity +=1
     }else{
       state.items.push({...action.payload,quantity:1})
     }
    },
    deleteProductfromCart:(state,action: PayloadAction<number>)=>{
     
      
  state.items = state.items.filter(item=>item.id!==action.payload)  

  
   
    },

    increaseProductQuantity:(state,action: PayloadAction<number>)=>{
      const item=state.items.find((i)=>i.id===action.payload)
      if(item){
        item.quantity +=1
      }
    },

    decreaseProductQuantity:(state,action: PayloadAction<number>)=>{
      const item=state.items.find((i)=>i.id===action.payload)
      if(item){
        if(item.quantity > 1){
          item.quantity -=1
        }else{
          state.items = state.items.filter((item) => item.id !== action.payload)
        }
      }
    },

    
     }   
 })
  export const {addProductToCart,deleteProductfromCart,increaseProductQuantity,decreaseProductQuantity}=cartSlice.actions
  export default cartSlice.reducer