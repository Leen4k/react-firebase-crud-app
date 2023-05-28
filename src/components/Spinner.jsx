import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";

const Spinner = () => {
  return (
    <div className='h-[80vh] flex items-center justify-center m-auto'>
        <ClipLoader
        color={"#000"}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  )
}

export default Spinner