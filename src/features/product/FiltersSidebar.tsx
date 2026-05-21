
import React from 'react'
import SearchInput from '../../components/searchInput';
import { FiArrowRight } from 'react-icons/fi';
function FiltersSidebar({ setCategory, categories}: { setCategory: React.Dispatch<React.SetStateAction<string>>, categories: string[] }) {
  const [isActive, setIsActive] = React.useState("all");  
const categoryLabels:Record<string,string> = {
  "all": "All",
  "men's clothing": "Men",
  "women's clothing": "Women",
  "jewelery": "Jewelery",
  "electronics": "Electronics",
};
const handelOnClick = (cat: string) => {
  setCategory(cat);
  setIsActive(cat);
}
  return (
   
    
    <aside className="bg-white p-4 shadow rounded-xl space-y-4 ">

    

      {/* Categories */}
      <div>
        <h3 className="font-bold mb-2">Categories</h3>
        <ul className="space-y-1">
        {categories.map((cat) => (
          <li key={cat} onClick={() => handelOnClick(cat)} className={`cursor-pointer hover:text-blue-600 ${isActive === cat ? 'text-blue-600 font-bold' : ''}`}>
          
          <FiArrowRight className='inline-block mr-1' />

          
           {categoryLabels[cat] || cat}
       {/* remove hr after last category */}
          {categories[categories.length-1] !== cat && <hr className='border-t border-gray-300 mt-1' />}
           </li>
        ))}  
         
        </ul>
      </div>

    

    </aside>
  );
}

export default FiltersSidebar;