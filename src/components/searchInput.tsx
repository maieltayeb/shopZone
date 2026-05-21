import React from 'react'
import { FiSearch } from 'react-icons/fi'

export default function SearchInput({ value, onChange, placeholder = "Search..." }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-center border rounded-lg px-4 py-2  max-w-md">
      <FiSearch className="text-gray-500" />
      <input
        type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
     
        className="bg-transparent border-none focus:outline-none"
      />
    </div>
  )
}
