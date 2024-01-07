
import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import Dropzone from 'react-dropzone'
import clsx from 'clsx';
import VideoPlayer from './artDisplay/videoPlayer';
import { Oval } from 'react-loader-spinner';
import HtmlViewer from './artDisplay/htmlViewer';
import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import("./artDisplay/modelDisplay"), {
  ssr: false
})

const MaxCLDFileSize = 30; //MB

export const cleanFileName = (fileName) => { 
  //remove extension, replace non-alphanumeric characters with dashes
  return fileName.split(".")[0].replaceAll(/[^a-zA-Z0-9_]/g, "-")
}

export const imageFormats = { "image/png": [], "image/jpeg": [], "image/gif": [], "image/webp": [] }

export const isGLB = (file) => { 
  const mimeType = file.type.includes("model")
  const splits = file.name.split(".")
  const extension = splits[splits.length-1].includes("glb")
  return  mimeType || extension
}

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
    setImage(null);
    setAltMedia(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      let fileCategory = CATEGORIES.IMAGE
      if (file.type.includes("video")) fileCategory = CATEGORIES.VIDEO
      if (file.type.includes("html")) fileCategory = CATEGORIES.HTML
      if (isGLB(file)) fileCategory = CATEGORIES.VR

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
  const formatDisplay = Object.keys(accept).join(", ")
    .replaceAll("image/", "")
    .replaceAll("video/", "")
    .replaceAll("text/", "")
    .replaceAll("model/gltf-binary", "glb")
  

  const textDisplay = (
    <div className='p-3 text-center flex flex-col gap-2 justify-center items-center'>
      <p className='text-red-500 capitalize'>{error}</p>  
      <p className='font-bold text-center'>Drag and drop your media file here, or tap to select</p>
      { helperText ? <p className='opacity-50'>{helperText}</p> : null }
      <p className='opacity-50'>Supported formats: {formatDisplay}</p>
      <p className='opacity-50'>Max file size {maxFileSize} MB</p>
    </div>
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
  const [loaded, setLoaded] = useState(false)
  const [contentInUse, setContentInUse] = useState(null)

  useEffect(() => {
    setTimeout(() => setContentInUse(content), 50)
    
    return () => setContentInUse(null)
  }, [content])

  const content = useMemo(() => {
    switch (category) {
      case CATEGORIES.VIDEO:
        return (
          <VideoPlayer
            wrapperClass='w-full h-full'
            setVideoLoaded={() => setLoaded(true)}
            videoUrl={mediaUrl}
          />
        )
      case CATEGORIES.HTML:
        return (
          <HtmlViewer
            wrapperClass='w-full h-full'
            onLoad={() => setLoaded(true)}
            htmlUrl={mediaUrl}
          />
        )
      case CATEGORIES.VR:
        return (
          <ModelViewer
            wrapperClass='w-full h-full'
            onLoad={() => setLoaded(true)}
            vrUrl={mediaUrl}
          />
        )
      default: return null
    }

  }, [category, mediaUrl])
  const preventPropAndDefault = (e) => {
    e.preventDefault();
    e.stopPropagation()
  }

  return (
    // Give the user room to click in the filedrop space but prevent clicks in the media
    <div className='p-5 w-full h-full'> 
      <div
        onClick={preventPropAndDefault}
        className={clsx(
          'w-full h-full relative',
        )}
      >
        {!loaded ? (
          <div className='absolute inset-0 w-full h-full flex justify-center items-center'>
            <span className="inline-block translate-y-0.5">
              <Oval color="#FFF" secondaryColor="#666" height={36} width={36} />
            </span>
          </div>
        ): null}
        { contentInUse}
      </div>
    </div>
  )
} 