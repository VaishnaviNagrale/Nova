import React from 'react'
import { IoSearchOutline } from "react-icons/io5";

function Search() {
  return (
    <>
      <div className='flex w-full p-1 h-full items-center  justify-center border-gray-700/80  rounded-full  outline-none max-md:max-w-full'>
        <input
          type='text'
          placeholder='Search'
          className='px-8 max-sm:px-2 max-lg:px-4 max-md:px-4 text-sm
        rounded-l-full text-pretty-font
          w-full h-full bg-black text-slate-100
          border border-gray-700/80  placeholder-gray-500 outline-none flex-grow focus:border-blue-800/80 focus:outline-none focus:ring-0.9 focus:ring-blue-800
          max-md:max-w-full 
          '
        />
        <div
          className='w-1/6 max-sm:max-w:full rounded-r-full flex flex-auto justify-center items-center  bg-[#3232327b] h-full border border-gray-700/80 cursor-pointer  
        '><IoSearchOutline className='text-2xl h-full' /></div>


      </div>
    </>
  )
}

export default Search
