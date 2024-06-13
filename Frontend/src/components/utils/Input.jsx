import React, { useId } from 'react';
const Input = React.forwardRef(function Input(
    {
        label,
        type = "text",
        className="",
        errorMessage,
        ...props
    },ref
){
    const id = useId()
    return (
        
        <div className='w-full'>
            {
            label && <label className='text-xs  text-gray-400 block m-1' htmlFor={id}>{label}<sup className='text-red-600 font-medium '>*</sup>
            </label>
            }
            <input
                type={type}
                className={`border border-gray-400/25 outline-none bg-gray-800  px-3 py-2 rounded-lg bg-inherit text-xs text-white  focus:ring-2 focus:ring-blue-800 duration-200 w-full
                ${errorMessage ? 'border-red-500' : ''}
             ${className}`}   
                ref={ref} // it will give ref to its parent component ref will pass from parent component and take access of state from here 
                {...props}
                id={id}
            />
            {errorMessage && <p className="text-red-500 text-xs italic"><sup className='text-red-600 font-medium mt-1'>*</sup>{errorMessage}</p>}
            </div>
        
    )

})
export default Input;