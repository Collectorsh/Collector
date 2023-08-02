import React, { useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

const ReactQuill = dynamic(
  () => import('react-quill'),
  { ssr: false }
);

const modules = {
  toolbar: [
    [{ 'size': [] }],
    // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    // ['link'],
    ['clean'],
    // [{ 'header': 1 }, { 'header': 2 }],
    // [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    // [{ 'script': 'sub' }, { 'script': 'super' }],
    // [{ 'indent': '-1' }, { 'indent': '+1' }],
    // [{ 'direction': 'rtl' }],
    // [{ 'color': [] }, { 'background': [] }],
    // [{ 'font': [] }],
  ]
};

const EditTextModuleModal = ({ textModule, onNewTextModule, isOpen, onClose }) => {
  const [newTextModule, setNewTextModule] = useState(textModule)
  
  const handleSave = () => {
    onNewTextModule(newTextModule)
    onClose()
  }

  const onChange = (content, delta, source, editor) => { 
    const newContent = editor.getContents()

    setNewTextModule(prev => ({
      ...prev,
      textDelta: JSON.stringify(newContent)
    }))
  }

  return (
    <Modal
      className="overflow-visible"
      isOpen={isOpen} onClose={onClose} title="Edit Text Module">
      <div className="my-4 border-4 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900
          w-full p-2
        ">
        <ReactQuill
          theme="snow"
          modules={modules}
          value={JSON.parse(newTextModule?.textDelta || "{}")}
          onChange={onChange}
        />

      </div>
      <div className="w-full flex justify-end gap-4">
        <MainButton onClick={onClose}>
          Cancel
        </MainButton>
        <MainButton onClick={handleSave} solid>
          Save
        </MainButton>
      </div>
    </Modal>
  )

}

export default EditTextModuleModal

export const QuillContent = ({ textDelta }) => { 

  return (
    <ReactQuill
      theme="bubble"
      readOnly
      value={JSON.parse(textDelta || "{}")}
    />
  )
}