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

export const QuillEditor = ({ textDelta, onChange }) => {
  const handleChange = (content, delta, source, editor) => {
    const newContent = editor.getContents()
    onChange(JSON.stringify(newContent))
  }
  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      value={JSON.parse(textDelta || "{}")}
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

export function deltaToPlainText(delta) {
  if (!delta || !delta.ops) {
    return '';
  }

  return delta.ops
    .map(op => {
      if (op.insert) return op.insert
      return '';
    })
    .join('');
}