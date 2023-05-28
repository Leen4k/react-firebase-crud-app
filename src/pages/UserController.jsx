import React, { useEffect } from 'react'
import { useParams,useNavigate } from 'react-router-dom';
import { useState } from 'react';


//firebase
import { db, storage } from '../firebase';
import { uploadBytesResumable,ref, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import Loader from '../components/Loader';



const initializeState = {
  name: '',
  email: '',
  info: '',
  contact: '',
}

const UserController = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(initializeState);
  const {name, email, major, contact} = data;
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null); 
  const [errors, setErrors] = useState(null);
  const [isSubmit, setIsSubmit] = useState(null);
  const {id} = useParams();
  console.log(id);

  const navigate = useNavigate();

  useEffect(() => {
    id && getSingleUser(); 
    setInterval(() => {
      setLoading(true);
    }, 600);
  },[id])

  const getSingleUser = async () => {
    const docRef = doc(db, 'users', id);
    const snapShot = await getDoc(docRef);
    if (snapShot.exists()){
      setData({...snapShot.data()});
    }
  }

  useEffect(()=>{
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      console.log(file)
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

    if(!id){
      try{
        await addDoc(collection(db,"users"), {...data, timestamp: serverTimestamp(),});
        console.log("submited")
      }catch(err){
        console.log(err);
      }
    } else {
      try{
        await updateDoc(doc(db,"users", id), {...data, timestamp: serverTimestamp(),});
        console.log("submited")
      }catch(err){
        console.log(err);
      }
    }

    navigate("/");
  }

  return (
    <div className='flex'>
      {!loading || isSubmit?(<Spinner />):
      <div className='flex flex-col gap-4 w-full'>
        <h2 className='text-bold'>{id?"Update User":"Add User"} {name}</h2>

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
        {progress !== null && progress < 100?<Loader />:<img src={data.img} alt="" className={`mt-4 rounded-md transition-all`} />}
        {progress !== null && progress < 100?<Loader />:<img src={data.img2} alt="" className={`mt-4 rounded-md transition-all`} />}
        <button 
          type="submit"
          disabled={progress !== null && progress < 100}
          className={`mb-4 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer mx-auto mt-4 p-2 rounded-md shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]`}>
          {id?"Update student":"Add student"}
        </button>
      </form>
    </div>
   }


    </div>
  )
}

export default UserController;