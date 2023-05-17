import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";

const Spinner = () => {
  return (
    <div className='h-screen flex items-center justify-center'>
        <ClipLoader
        color={"#000"}
        // loading={loading}
        // cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  )
}

export default Spinner