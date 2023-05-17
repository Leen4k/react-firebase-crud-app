import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();
  return (
    <nav className='flex justify-between py-4 m-auto'>
        <div>
            <p>Logo</p>
        </div>
        <div className='flex gap-4'>
            <Link to='/' className='shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] p-2 rounded-sm'>home</Link>
            <button className='shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] p-2 rounded-sm' onClick={()=>navigate("/add")}>Add User</button>
        </div>
    </nav>
  )
}

export default Navbar