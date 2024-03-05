import { useState } from 'react';
import EditWrapper from '../curatorProfile/editWrapper';
import EditTextModuleModal from './editTextModuleModal';
import * as Icon from 'react-feather';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
const QuillContent = dynamic(() => import('../Quill').then(mod => mod.QuillContent), { ssr: false })

const TextModule = ({ textModule, onEditTextModule, isOwner, onDeleteModule }) => { 
  const [editTextOpen, setEditTextOpen] = useState(false)
  return (
    <div
      className={clsx("relative group/textModule w-full h-fit min-h-[4rem]", isOwner && "cursor-pointer")}
      onClick={() => isOwner && setEditTextOpen(true)}
    >
      <EditWrapper
        isOwner={isOwner}
        onEdit={() => setEditTextOpen(true)}
        placement="tr"
        groupHoverClass="group-hover/textModule:opacity-100 group-hover/textModule:scale-105"
        // text="Edit Text"
        icon={<Icon.Edit size={24} strokeWidth={2.5} className='m-[1px]'/>}
      >
        <QuillContent textDelta={textModule.textDelta} />
      </EditWrapper>
      {isOwner && !textModule.textDelta
        ? (
          <div
            className='absolute inset-0 w-full h-full flex justify-center items-center p-2 '
          >
            <p>Click this block to edit your text!</p>
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