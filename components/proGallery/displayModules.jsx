import TextModule from './textModule'
import ArtModule from './artModule'
import SortableModule from './sortableModule'
import SortableModulesWrapper from './sortableModulesWrapper'

const DisplayModules = ({modules, setModules, isOwner, submittedTokens}) => {

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

  if (isOwner) return (
    <SortableModulesWrapper
      className="grid grid-cols-1 gap-4 p-4"
      setModules={setModules}
      modules={modules}
      moduleComponents={modules.map((module, i) => (
        <SortableModule
          key={module.id}
          id = {module.id}
        >
          <Module module={module} handleEditModule={handleEditModule} submittedTokens={submittedTokens} isOwner onDeleteModule={()=>handleDeleteModule(module.id)} />
        </SortableModule>
      ))}
    />
  )

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {modules.map((module, i) => (
        <div key={module.id}>
          <Module module={module} />
        </div>
      ))}
    </div>
  )
}

export default DisplayModules

export const Module = ({ module, handleEditModule, isOwner, submittedTokens, onDeleteModule }) => {
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
        />
      )
    }
  }
} 