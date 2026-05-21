
export default function ProductSort({setSort}: {setSort: React.Dispatch<React.SetStateAction<string>>}) {
      const sortOptions = ["default", "low", "high"];
  return (

  <div className="flex items-center  p-2 rounded-md">
  <label htmlFor="sort" className="mr-2 font-medium">Sort by:</label>
      <select
        onChange={(e) => setSort(e.target.value)}
        className=" border p-2 rounded-md"
      >
      {sortOptions.map((option) => (         
        <option value={option} key={option}>
          {option === "default"?"Default":`price: ${option}`}
      
        </option>
      ))}
      </select>
     
        </div>
  )
}
