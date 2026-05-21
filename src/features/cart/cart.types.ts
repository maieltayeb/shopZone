import {  Product } from "../product/product.types";

export interface CartItem extends Product {
  quantity: number;
}
export interface CartState {
  items: CartItem[];
} 