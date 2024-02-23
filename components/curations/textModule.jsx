import { useState } from 'react';
import EditWrapper from '../curatorProfile/editWrapper';
import EditTextModuleModal from './editTextModuleModal';
import * as Icon from 'react-feather';
import dynamic from 'next/dynamic';
const QuillContent = dynamic(() => import('../Quill').then(mod => mod.QuillContent), { ssr: false })

const TextModule = ({ textModule, onEditTextModule, isOwner, onDeleteModule }) => { 
  const [editTextOpen, setEditTextOpen] = useState(false)
  return (
    <div className="relative group w-full h-fit min-h-[4rem]"
      onClick={()=> setEditTextOpen(true)}
    >
      <EditWrapper
        isOwner={isOwner}
        onEdit={() => setEditTextOpen(true)}
        placement="tr"
        groupHoverClass="group-hover:opacity-100"
        text="Edit Text"
        icon={<Icon.Edit size={20} strokeWidth={2.5} />}
      >
        <QuillContent textDelta={textModule.textDelta} />
      </EditWrapper>
      {isOwner && !textModule.textDelta
        ? (
          <div className='absolute inset-0 w-full h-full flex justify-center items-center p-2'>
            <p>Click the gear icon in the top right to edit this Text Module</p>
          </div>
        )
        : null
      }
      {isOwner
        ? (
          <EditTextModuleModal
            textModule={textModule}
            onEditTextModule={onEditTextModule}
            onDeleteModule={onDeleteModule}
            isOpen={editTextOpen}
            onClose={() => setEditTextOpen(false)}
          />
        )
        : null
      }
    </div>
  )
}

export default TextModule;