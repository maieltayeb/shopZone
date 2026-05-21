
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FiltersSidebar from '../features/product/FiltersSidebar'
import SearchInput from '../components/searchInput'
 import { useState } from 'react'    
import ProductSort from '../features/product/productSort'
import { startTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../services/api'
import { getProducts } from '../features/product/productSlice'
import { useEffect ,useMemo} from 'react'
import ProductCard from '../components/productCard'
import Loader from '../components/ui/loader'
import { RootState } from '../app/store'
import type { Product } from '../types'

export default function Products() {
  const dispatch = useDispatch()

  const [categories, setCategories] = useState(["all"]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const productsData=useSelector((state:RootState)=>state.products.items)
  const [searchQuery, setSearchQuery] = useState("");
     
const [inputValue, setInputValue] = useState("");
const handelSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
setInputValue(value);

 startTransition(() => {
      setSearchQuery(value); // ✅ non-urgent: الفلتر يستنى لو في حاجة أهم
    });
}


const filteredProducts = useMemo(() => {
  let result = productsData;

  // Filter by category
  if (selectedCategory !== "all") {
    result = result.filter(
      (product) => product.category === selectedCategory
    );
  }
// filter by search 
  if (searchQuery.trim()) {
    result = result.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  //Filter by price
if (sort === "low"||sort=="Default") {
  result = [...result].sort((a, b) => a.price - b.price);
} else if (sort === "high") {
  result = [...result].sort((a, b) => b.price - a.price);
} 

  return result;
}, [selectedCategory, searchQuery, productsData, sort]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data: Product[] = await getAllProducts();  
      dispatch(getProducts(data));
     const uniqueCategories = ["all", ...new Set(data.map((p: Product) => p.category))];
    setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error from pppppp', error);
    }

  };
  fetchProducts();  
}, [dispatch])



  return (
<>   
  
  
        <h1 className=" px-3  text-3xl font-bold mb-6">Products</h1>
       

 
    <div className="px-3 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
    <div className="md:col-span-1">
    <SearchInput 
      value={inputValue} 
      onChange={handelSearchChange} 
      className="w-full"
    />
  </div>

 
  <div className="md:col-span-3 flex md:justify-end">
    <ProductSort setSort={setSort} />
  </div>
   
    <div className="md:col-span-1">
   
      <FiltersSidebar   setCategory={setSelectedCategory} categories={categories}/>
      </div>
    <div className="md:col-span-3">  
       <div className="grid  items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">   
       {filteredProducts.length > 0 ? (
         filteredProducts.map(product=>(
         <ProductCard key={product.id} product={product} />
         ))
       ) : (
    <Loader/>
       )}
  
           </div>  
        </div>
</div>
 

</>   

  )
}
// <div className='container mx-auto py-8 items-center justify-between  mb-6 flex flex-col md:flex-row gap-6'>   
    // <SearchInput value={search} onChange={onchange}  className="flex-1 max-w-md"/>
    // <ProductSort className="w-90 text-green-500  " />
    // </div>
//      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
//   <SearchInput 
//     value={search} 
//     onChange={onchange} 
//     className="w-full md:max-w-md"
//   />

//   <ProductSort className="w-full md:w-auto" />
// </div>