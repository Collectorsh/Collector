import { Suspense, useMemo } from 'react';
import SortableModule from './sortableModule'
import SortableModulesWrapper from './sortableModulesWrapper'
import TextModule from './textModule'
import ArtModule from './artModule'


const DisplayModules = ({
  modules,
  setModules,
  isOwner,
  submittedTokens,
  approvedArtists,
  handleCollect,
  curationType,
  curationId,
  setSubmittedTokens,
  owners,
  disabled
}) => {
  const handleEditModule = (newModule) => {
    const newModules = [...modules];
    const index = newModules.findIndex((module) => module.id === newModule.id);
    newModules[index] = newModule;
    setModules(newModules);
  }

  const handleDeleteModule = (id) => { 
    const newModules = [...modules];
    const index = newModules.findIndex((module) => module.id === id);
    newModules.splice(index, 1);
    setModules(newModules);
  }

  const tokenMintsInUse = useMemo(() => {
    return modules?.reduce((acc, module) => {
      if (module.type === "art") acc[module.id] = module.tokens
      return acc
    }, {})
  }, [modules])


  if (isOwner) return (
    <SortableModulesWrapper
      className="grid grid-cols-1 gap-4 py-4 md:p-4"
      setModules={setModules}
      modules={modules}
      submittedTokens={submittedTokens}
      approvedArtists={approvedArtists}
      moduleComponents={modules?.map((module, i) => (
        <SortableModule
          key={module.id}
          id = {module.id}
        >
          <Module
            isOwner
            module={module}
            handleEditModule={handleEditModule}
            submittedTokens={submittedTokens}
            onDeleteModule={() => handleDeleteModule(module.id)}
            approvedArtists={approvedArtists}
            tokenMintsInUse={tokenMintsInUse}
            curationType={curationType}
            curationId={curationId}
            setSubmittedTokens={setSubmittedTokens}
            owners={owners}
            disabled={disabled}
          />
        </SortableModule>
      ))}
    />
  )

  return (
    <div className="grid grid-cols-1 gap-4 py-4 md:p-4">
      {modules?.map((module, i) => (
        <div key={module.id} className='border-4 border-transparent'>
          <Module
            module={module}
            curationType={curationType}
            submittedTokens={submittedTokens}
            approvedArtists={approvedArtists}
            handleCollect={handleCollect}
            owners={owners}
          />
        </div>
      ))}
    </div>
  )
}

export default DisplayModules

export const Module = ({
  module,
  handleEditModule,
  isOwner,
  submittedTokens,
  onDeleteModule,
  approvedArtists,
  handleCollect,
  tokenMintsInUse,
  curationType,
  curationId,
  setSubmittedTokens,
  owners,
  disabled
}) => {
  switch (module.type) {
    case "text": {
      return (
        <TextModule
          onDeleteModule={onDeleteModule}
          textModule={module}
          onEditTextModule={handleEditModule}
          isOwner={isOwner}
          disabled={disabled}
        />
      )
    }
    case "art": {
      return (
        <ArtModule
          onDeleteModule={onDeleteModule}
          artModule={module}
          onEditArtModule={handleEditModule}
          isOwner={isOwner}
          submittedTokens={submittedTokens}
          approvedArtists={approvedArtists}
          handleCollect={handleCollect}
          tokenMintsInUse={tokenMintsInUse}
          curationType={curationType}
          curationId={curationId}
          setSubmittedTokens={setSubmittedTokens}
          owners={owners}
          disabled={disabled}
        />
      )
    }
  }
} 