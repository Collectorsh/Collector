
import { createRef, useState } from 'react';
import Dropzone from 'react-dropzone'
import MainButton from './MainButton';

const MaxCLDFileSize = 15000000; // 15MB (technically its a little under 20MB)

const FileDrop = ({ onDrop, acceptableFiles, helperText }) => {
  const dropzoneRef = createRef();
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);

  const handleDrop = (acceptedFiles) => { 
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(Buffer.from(reader.result));
      onDrop(Buffer.from(reader.result))
      setError(null);
    };
    reader.readAsDataURL(file);
  }
  const handleRejected = (fileRejections) => {
    setImage(null);
    const errorMessage = fileRejections[0].errors[0].code.replaceAll("-", " ")
    setError(errorMessage)
  }

  const openFileDialog = () => {
    if (dropzoneRef.current) dropzoneRef.current.open()
  };

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
              <div className='absolute inset-0  flex justify-center items-center'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Preview" className='object-cover w-full h-full' />
              </div>
            ): null}
        </div>
      </section>
    )}
  </Dropzone>
  )
}

export default FileDrop;