import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import Quill from "quill";

const Size = Quill.import('attributors/style/size');
const sizeOptions = ['12px', '16px', '24px', "32px"];
Size.whitelist = [...sizeOptions, "small", "normal", "large", "huge"];
Quill.register(Size, true);

const ReactQuill = dynamic(
  () => import('react-quill'),
  { ssr: false }
);

const modules = {
  toolbar: [
    // [{ 'size': [] }],
    [{ 'size': sizeOptions }],
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
      attributes: { size: "16px" },
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

