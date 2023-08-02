import { useState } from 'react';
import EditWrapper from '../curatorProfile/editWrapper';
import EditTextModuleModal, { QuillContent } from './editTextModuleModal';

const TextModule = ({ textModule, onNewTextModule, isOwner }) => { 
  const [editTextOpen, setEditTextOpen] = useState(false)
  return (
    <div className="relative group w-full">
      <EditWrapper
        isOwner={isOwner}
        onEdit={() => setEditTextOpen(true)}
        placement="outside-tr"
        groupHoverClass="group-hover:opacity-100"
      >
        <QuillContent textDelta={textModule.textDelta} />
      </EditWrapper>
      {isOwner
        ? (
          <EditTextModuleModal
            textModule={textModule}
            onNewTextModule={onNewTextModule}
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