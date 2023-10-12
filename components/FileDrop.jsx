
import { createRef, useEffect, useRef, useState } from 'react';
import Dropzone from 'react-dropzone'
import clsx from 'clsx';
import VideoPlayer from './artDisplay/videoPlayer';

const MaxCLDFileSize = 20; 

export const cleanFileName = (fileName) => { 
  //remove extension, replace non-alphanumeric characters with dashes
  return fileName.split(".")[0].replaceAll(/[^a-zA-Z0-9_]/g, "-")
}

export const imageFormats = {"image/png": [], "image/jpeg": [], "image/gif": [], "image/webp": []}

export const CATEGORIES = {
  IMAGE: "image",
  VIDEO: "video",
  HTML: "html",
  VR: "vr",
}

const FileDrop = ({
  onDrop,
  acceptableFiles,
  helperText,
  imageClass = "object-cover",
  maxFileSize = MaxCLDFileSize
}) => {
  const dropzoneRef = createRef();
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [altMedia, setAltMedia] = useState(null);
  const [category, setCategory] = useState(CATEGORIES.IMAGE)

  const maxFileSizeBytes = maxFileSize * 1000000

  const handleDrop = (acceptedFiles) => { 
    const file = acceptedFiles[0];
    onDrop(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      let fileCategory = CATEGORIES.IMAGE
      if (file.type.includes("video")) fileCategory = CATEGORIES.VIDEO
      if (file.type.includes("html")) fileCategory = CATEGORIES.HTML

      //TODO does this need file.type.includes("glb") ?
      if (file.type.includes("model")) fileCategory = CATEGORIES.VR

      setCategory(fileCategory)
      if (fileCategory === CATEGORIES.IMAGE) setImage(reader.result);
      else setAltMedia(reader.result);

      setError(null);
    };
    reader.readAsDataURL(file);
  }
  
  const handleRejected = (fileRejections) => {
    setImage(null);
    setAltMedia(null);
    const errorMessage = fileRejections[0].errors[0].code.replaceAll("-", " ")
    setError(errorMessage)
  }

  const accept = acceptableFiles || imageFormats

  //TODO: add vr format here
  const formatDisplay = Object.keys(accept).join(", ").replaceAll("image/", "").replaceAll("video/", "").replaceAll("html/", "")
  

  const textDisplay = (
    <>
      <p className='text-red-500 capitalize'>{error}</p>  
      <p className='font-bold text-center'>Drag and drop your media file here, or click to select</p>
      { helperText ? <p className='opacity-50'>{helperText}</p> : null }
      <p className='opacity-50'>Supported formats: {formatDisplay}</p>
      <p className='opacity-50'>Max file size {maxFileSize} MB</p>
    </>
  )
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
         
          {(!image && !altMedia) ? textDisplay : null}
          {altMedia ? <AltMedia mediaUrl={altMedia} category={category} /> : null}
          {image ? (
            <div
              className='absolute inset-0 flex justify-center items-center'
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

export const AltMedia = ({ category, mediaUrl }) => {
  switch (category) {
    case CATEGORIES.VIDEO:
      return (
        <VideoPlayer
          videoUrl={mediaUrl}
        />
      )
    // case CATEGORIES.HTML:
    //   return (
    //     <iframe
    //       src={altMedia}
    //       className="w-full h-full object-cover rounded-lg"
    //     />
    //   )
    default: return null
  }
} 