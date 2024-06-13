import React from 'react'
import Button from '../utils/Button';
import { useSelector } from 'react-redux';
import Logout from './Logout';
import Search from './Search';
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate()
    const authStatus = useSelector(state => state.auth.status);

  return (
    <>
        <header>
            <div className="flex h-full justify-between w-full border-b border-gray-50/20  max-md:max-w-full pb-1">
            <div className='flex max-sm:h-10 max-sm:w-10 w-fit ml-5 max-sm:ml-0'>
                {/* logo */}
                <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/f8e9f7ed166074f1b63f89c6d1a258945ffa6a02a0a5635fe2466e73d82e2a5f?apiKey=2a71bb6c876b4ac2af76de651fbd6a28&"
                        alt="Logo"
                        className="shrink-0 self-stretch cursor-pointer aspect-square w-[63px]"
                        onClick={()=>navigate('/')}
                       
                    />
            </div>
            {/* search box */}

{/* <div>
    
</div> */}
            <div className='flex w-[40%] max-md:w-[60%] max-lg:w-[60%] max-sm:w-[60%] max-sm:gap-2'>
    <Search/>
            </div>  

            {
                authStatus ? (
                    <div className='flex  text-sm  mr-12  items-center 
                 gap-2 min-md:mr-0 max-sm:mr-0 '>

                    <Logout/>
                    </div>
                   //todo-> profile Icon and inside logout
                ) : (<ul className='flex  text-sm  mr-12  items-center 
                 gap-2 min-md:mr-0 max-sm:mr-0 '>
                <li><button 
                onClick={()=>navigate('/login')} className='cursor-pointer  text-white outline-none hover:ring-2  hover:ring-blue-800 px-5 py-2
                max-md:px-2 max-md:py-1 max-sm:px-1 max-sm:py-1
                 hover:rounded-lg  hover:bg-gray-700/80 rounded-lg'>Login</button></li>
                <li>
  <button
    onClick={()=>navigate('/signup')}
    className="cursor-pointer text-white outline-none hover:ring-2  hover:ring-blue-800 px-5 py-2 
    max-md:px-2 max-md:py-1 max-sm:px-0 max-sm:py-1 hover:rounded-lg hover:bg-gray-700/80 "
  >
    Signup
  </button>
</li>
                </ul>)
            }



            </div>
        </header>
    </>






  )
}

export default Header
