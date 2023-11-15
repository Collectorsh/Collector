import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { useEffect, useRef } from "react";

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
    ['link'],
    // ['clean'],
    // [{ 'header': 1 }, { 'header': 2 }],
    // [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    // [{ 'script': 'sub' }, { 'script': 'super' }],
    // [{ 'indent': '-1' }, { 'indent': '+1' }],
    // [{ 'direction': 'rtl' }],
    // [{ 'color': [] }, { 'background': [] }],
    // [{ 'font': [] }],
  ],
  clipboard: {
    matchVisual: false,
    matchers: [
      [Node.ELEMENT_NODE, (node, delta) => {
        delta.ops = delta.ops?.map(op => {
          if (op.attributes?.background) op.attributes.background = "";
          if (op.attributes?.color) op.attributes.color = "";
          if (op.attributes?.token) op.attributes.token = "";
          return op;
        })
        return delta;
      }]
    ]
  }
}

export const initialDeltaContent = JSON.stringify({
  ops: [
    {
      attributes: { size: 'large' },
      insert: " "
    },
    {
      attributes: { align: 'center' },
      insert: "\n"
  },
  ]
})

export const QuillEditor = ({ textDelta, onChange }) => {
  const handleChange = (content, delta, source, editor) => {
    const newContent = editor.getContents()

    newContent.ops = newContent.ops?.map(op => { 
      if (op.attributes?.background) op.attributes.background = "";
      if (op.attributes?.color) op.attributes.color = "";
      if (op.attributes?.token) op.attributes.token = "";
      return op;
    }) 
    onChange(JSON.stringify(newContent))
  }

  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      value={JSON.parse(textDelta || initialDeltaContent)}
      onChange={handleChange}   
    />
  )
}

export const QuillContent = ({ textDelta }) => {
  return (
    <ReactQuill
      theme="bubble"
      readOnly
      value={JSON.parse(textDelta || "{}")}
    />
  )
}

