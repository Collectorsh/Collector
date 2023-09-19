
import { createRef, useEffect, useRef, useState } from 'react';
import Dropzone from 'react-dropzone'
import MainButton from './MainButton';
import clsx from 'clsx';

const MaxCLDFileSize = 15000000; // 15MB (technically its a little under 20MB)

export const cleanFileName = (fileName) => { 
  //remove extension, replace non-alphanumeric characters with dashes
  return fileName.split(".")[0].replaceAll(/[^a-zA-Z0-9_]/g, "-")
}

const FileDrop = ({ onDrop, acceptableFiles, helperText, imageClass }) => {
  const dropzoneRef = createRef();
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);

  const [imgHeight, setImgHeight] = useState(0);
  const imgWrapperRef = useRef();

  useEffect(() => {
    if (!imgWrapperRef.current) return
    const getHeight = () => {
      setImgHeight(imgWrapperRef.current?.clientHeight)
    }

    getHeight()
    window.addEventListener("resize", getHeight);
    return () => window.removeEventListener("resize", getHeight);
  }, [])

  const handleDrop = (acceptedFiles) => { 
    const file = acceptedFiles[0];
    onDrop(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setError(null);
    };
    reader.readAsDataURL(file);
  }
  
  const handleRejected = (fileRejections) => {
    setImage(null);
    const errorMessage = fileRejections[0].errors[0].code.replaceAll("-", " ")
    setError(errorMessage)
  }

  const accept = acceptableFiles || { "image/*": [".png", ".gif", ".jpeg", ".jpg"] }
  
  return (
    <Dropzone
      ref={dropzoneRef} 
      accept={accept}
      maxFiles={1}
      onDropAccepted={handleDrop}
      onDropRejected={handleRejected}
      // onError={(err) => setError(err)}
      multiple={false}
      maxSize={MaxCLDFileSize}
    >
    {({ getRootProps, getInputProps }) => (
      <section className='w-full h-full border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden '>
        <div {...getRootProps()} className='w-full h-full flex flex-col gap-2 justify-center items-center relative cursor-pointer'>
          <input {...getInputProps()} />
          <p className='text-red-500 capitalize'>{error}</p>  
          <p className='font-bold'>Drag and drop your image file here, or click to select</p>
          {helperText ? <p className='opacity-50'>{helperText}</p> : null}
          <p className='opacity-50'>Supported formats { accept["image/*"].join(", ")}</p>
          <p className='opacity-50'>Max file size {MaxCLDFileSize/1000000} MB</p>
          
            {image ? (
              <div
                className='absolute inset-0 flex justify-center items-center backdrop-blur-md'
              >

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Preview"
                  className={clsx('object-cover w-full h-full', imageClass)}
                />
             
              </div>
            ): null}
        </div>
      </section>
    )}
  </Dropzone>
  )
}

export default FileDrop;