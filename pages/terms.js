import ReactMarkdown from 'react-markdown'
import matter from "gray-matter";
import fs from 'fs';
import path from 'path';
import MainNavigation from '../components/navigation/MainNavigation';

export default function Terms({ content }) {
  return (
    <>
      <MainNavigation />
      <div className='max-w-screen-xl mx-auto p-4 sm:p-8 markdown'>
        <ReactMarkdown>
          {content}
        </ReactMarkdown>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), '/public/terms.md');
  const fileContent = fs.readFileSync(filePath).toString();
  const { content } = matter(fileContent);

  return {
    props: {
      content,
    },
  };
}