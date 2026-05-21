export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  inStock: boolean;
 description: string;
 image: string;
 category: string;
 rating: number;
 reviews: number;
 features: string[];
}
export interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}