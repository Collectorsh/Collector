
import { createRef, useEffect, useRef, useState } from 'react';
import Dropzone from 'react-dropzone'
import clsx from 'clsx';

const MaxCLDFileSize = 15; 

export const cleanFileName = (fileName) => { 
  //remove extension, replace non-alphanumeric characters with dashes
  return fileName.split(".")[0].replaceAll(/[^a-zA-Z0-9_]/g, "-")
}

const FileDrop = ({
  onDrop, acceptableFiles, helperText,
  imageClass = "object-cover",
  maxFileSize = MaxCLDFileSize
}) => {
  const dropzoneRef = createRef();
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);

  const maxFileSizeBytes = maxFileSize * 1000000

  const reset = () => {
    setImage(null);
    setError(null);
  }

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
      multiple={false}
      maxSize={maxFileSizeBytes}
    >
    {({ getRootProps, getInputProps }) => (
      <section className='w-full h-full border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden '>
        <div {...getRootProps()} className='w-full h-full flex flex-col gap-2 justify-center items-center relative cursor-pointer'>
          <input {...getInputProps()} />
          <p className='text-red-500 capitalize'>{error}</p>  
          <p className='font-bold text-center'>Drag and drop your image file here, or click to select</p>
          {helperText ? <p className='opacity-50'>{helperText}</p> : null}
          <p className='opacity-50'>Supported formats { accept["image/*"].join(", ")}</p>
            <p className='opacity-50'>Max file size {maxFileSize} MB</p>
          
            {image ? (
              <div
                className='absolute inset-0 flex justify-center items-center backdrop-blur-md'
              >

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Preview"
                  className={clsx("w-full h-full", imageClass)}
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