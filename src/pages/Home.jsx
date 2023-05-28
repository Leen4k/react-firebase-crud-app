import React, { useState, useEffect, useRef } from 'react'
import Spinner from '../components/Spinner'
import { useNavigate } from 'react-router-dom';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import {HiOutlinePencilAlt} from 'react-icons/hi'
import {AiFillDelete} from 'react-icons/ai'
import { ClimbingBoxLoader } from 'react-spinners';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [user , setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    setLoading(true);

    const unSub = onSnapshot(collection(db,"users"), (snapshot)=>{
      let list = [];
      snapshot.docs.forEach((doc)=>{
        list.push({id:doc.id, ...doc.data()})
      });
      setUsers(list);
      setLoading(false);
    },(error)=>{console.log(error)})
    return () => {unSub()};
  },[])

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this student?")){
      try{
        setUser(id)
        await deleteDoc(doc(db,"users",id));
        setUsers(users.filter(user => user.id !== id));
      }catch(err){
        console.log(err)
      }
    }
  }


  // console.log(users)
  return (
    <div >
     <h1 className='font-bold mb-4'>Users</h1>
     {loading?<Spinner />:
     <div className='grid lg:grid-cols-3 gap-4 mb-4'>
        {(users && users.map((item)=>(
          <article key={item.id} className='flex col-span-1 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]'>
            <div className='flex justify-center items-center basis-1/2 overflow-hidden'>
              <img className='h-full aspect-square object-contain rounded-md' src={item.img} alt="" />
            </div>
            <div className='flex flex-col justify-center gap-2 p-2 basis-1/2'>
              <p>Name: <span className='text-slate-500'>{item.name}</span></p>
              <p>Email: <span className='text-slate-500'>{item.email}</span></p>
              <p>Major: <span className='text-slate-500'>{item.major}</span></p>
              <p>Contact: <span className='text-slate-500'>{item.contact}</span></p>
            </div>
            <div className='gap-2 flex flex-col m-2 h-auto absolute'>
              <span className='text-green-400 text-xl hover:scale-125 transition' onClick={() => {navigate(`/update/${item.id}`)}}><HiOutlinePencilAlt /></span>
              <span className='text-red-400 text-xl hover:scale-125 transition' onClick={() => {navigate(`/delete/${item.id}`);handleDelete(item.id);navigate("/")}}><AiFillDelete/></span>    
            </div>
          </article>
        )))}
     </div>
     }


    </div>
  )
}

export default Home