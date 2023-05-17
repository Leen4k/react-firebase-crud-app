import React, { useEffect } from 'react'
import { useParams,useNavigate } from 'react-router-dom';
import { useState } from 'react';


//firebase
import { db, storage } from '../firebase';
import { uploadBytesResumable,ref, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import Spinner from '../components/Spinner';



const initializeState = {
  name: '',
  email: '',
  info: '',
  contact: '',
}

const UserController = () => {

  const [data, setData] = useState(initializeState);
  const {name, email, major, contact} = data;
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null); 
  const [errors, setErrors] = useState(null);
  const [isSubmit, setIsSubmit] = useState(null);

  const navigate = useNavigate();

  useEffect(()=>{
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed", (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        switch (snapshot.state) {
          case "paused":
            console.log("upload is paused");
          case 'running':
           console.log("Upload is running");
          default:
            break;
        }
      },(error)=>{
        console.log(error)
      },() => {
        getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL)=>{
          setData((prev) => ({...prev, img:downloadURL}))
        })
      }
      );
    };

    file && uploadFile();
  },[file])

  const handleChange = (e) => {
    setData({...data, [e.target.name]: e.target.value});
  }

  const validate = () => {
    let errors ={};
    if(!name){
      errors.name ="Name is required,";
    }
    if(!email){
      errors.email = "Email is required,";
    }
    if(!major){
      errors.major = "Major is required,";
    }
    if(!contact){
      errors.contact ="Contact is required,";
    }

    return errors;

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = validate();
    if (Object.keys(errors).length) return setErrors(errors);

    //starting of data uploadd
    setIsSubmit(true);
    await addDoc(collection(db,"users"), {...data, timestamp: serverTimestamp(),});
    console.log("submited")
    navigate("/");

    // return (Object.keys(errors).length ? setErrors(errors) : null);
  }

  return (
    <div className='flex'>
      {isSubmit?(<Spinner />):
      <div className='flex flex-col gap-4 w-full'>
        <h2 className='text-bold'>Add User {name}</h2>

        <form onSubmit={handleSubmit} action='' className='flex flex-col text-sm text-slate-500 gap-1'>

        <label htmlFor="" className='mt-4'>Name</label>
        <input 
          name='name' 
          type='text' 
          placeholder='Enter name' 
          onChange={handleChange} 
          value={name}
          className='rounded-md shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] p-2'
        />

        <label htmlFor="" className='mt-4'>Email</label>
        <input 
          name='email' 
          type='text' 
          placeholder='Enter Email Address'  
          onChange={handleChange} 
          value={email}
          className='rounded-md shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] p-2'
        />

        <label htmlFor="" className='mt-4'>Major</label>
        <input 
          name='major' 
          type='text' 
          placeholder='Enter Student Major'  
          onChange={handleChange} 
          value={major}
          className='rounded-md shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] p-2'
        />

        <label htmlFor="" className='mt-4'>contact</label>
        <input 
          name='contact' 
          type='text' 
          placeholder='Enter Student Contact'  
          onChange={handleChange} 
          value={contact}
          className='rounded-md shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] p-2'
        />

        <label htmlFor="" className='mt-4'>Upload File</label>
        <input type='file' onChange={(e)=> setFile(e.target.files[0])} className='' />


        <span className={`text-red-400`}>{errors && (errors.name +'  '+ errors.email +'  '+errors.major+'  '+errors.contact) }</span>
        <button 
          type="submit"
          disabled={progress !== null && progress < 100}
          className='mx-auto mt-4 p-2 rounded-md shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]'>Add Student</button>
      </form>
    </div>
   }


    </div>
  )
}

export default UserController;