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
  handleCollect
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
    return modules.reduce((acc, module) => {
      if (module.type === "art") acc[module.id] = module.tokens
      return acc
    }, {})
  }, [modules])


  if (isOwner) return (
    <SortableModulesWrapper
      className="grid grid-cols-1 gap-4 p-4"
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
          />
        </SortableModule>
      ))}
    />
  )

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {modules?.map((module, i) => (
        <div key={module.id}>
          <Module
            module={module}
            submittedTokens={submittedTokens}
            approvedArtists={approvedArtists}
            handleCollect={handleCollect}
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
  tokenMintsInUse
}) => {
  switch (module.type) {
    case "text": {
      return (
        <TextModule
          onDeleteModule={onDeleteModule}
          textModule={module}
          onEditTextModule={handleEditModule}
          isOwner={isOwner}
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
        />
      )
    }
  }
} 