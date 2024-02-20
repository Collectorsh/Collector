import { Fragment, useState } from "react"
import MainButton from "../MainButton"
import Modal from "../Modal"
import { getIcon, socialTypes } from "../SocialLink"
import { Menu, Transition } from "@headlessui/react"
import clsx from "clsx"

import * as Icon from 'react-feather'

const EditSocialsModal = ({ socials, onSave, isOpen, onClose }) => { 
  const [newSocials, setNewSocials] = useState(socials || [])

  const cantSave = newSocials.some(social => social.link === "")
  const noMoreSocials = newSocials.length >= 5

  const handleSave = () => {
    onSave(newSocials)
    onClose()
  }
  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setNewSocials(socials)
    }, 500);
  }

  const addSocial = () => { 
    if (noMoreSocials) return
    setNewSocials(prev => [...prev, { type: "other", link: "" }])
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Socials" widthClass="max-w-lg">

      <div className="pb-6">
        {newSocials.map((social, i) => (<SocialItem key={i} {...social} index={i} setNewSocials={setNewSocials} />))}
        <MainButton
          onClick={addSocial}
          className={clsx(
            "w-full h-10 p-0 flex items-center justify-center gap-2",
            noMoreSocials ? "hidden" : ""
          )}
          disabled={noMoreSocials}
        >
          Add Social 
          <Icon.Plus size={20} />
        </MainButton>
      </div>
      <div className="w-full flex justify-end gap-4">
        <MainButton onClick={handleClose} size="lg" standardWidth>
          Cancel
        </MainButton>
        <MainButton onClick={handleSave} solid disabled={cantSave} size="lg" standardWidth>
          Save
        </MainButton>
      </div>
    </Modal>
  )

}

export default EditSocialsModal

const SocialItem = ({ type, link, setNewSocials, index }) => { 
  

  const getPrefix = () => {
    switch (type) {
      case "twitter": return "https://twitter.com/"
      case "instagram": return "https://instagram.com/"
      case "other":
      default: return ""
    }
  } 

  const removeSocial = () => {
    setNewSocials(prev => prev.filter((_, i) => i !== index))
  }
  const editLink = (e) => {
    setNewSocials(prev => prev.map((social, i) => {
      return i === index
        ? {
          ...social,
          link: getPrefix() + e.target.value
        }
        : social
    }))
  }

  const editType = (newType) => { 
    setNewSocials(prev => prev.map((social, i) => {
      return i === index
        ? {
          ...social,
          type: newType
        }
        : social
    }))
  }

  return (
    <div className="w-full my-3 shadow rounded p-2 flex justify-between items-center gap-8
      palette2
    "
    >
      <div className="flex justify-between items-center gap-2 w-full">
        <SocialIconDropdown type={type} setType={editType} />
        <div className="flex items-center w-full">
          <p className="text-sm">
            {getPrefix().replace("https://", "")}
          </p>
          <input
            className="bg-transparent outline-none border-b-2 borderPalette2 w-full pl-1"
            type="text"
            value={link.replace(getPrefix(), "")}
            onChange={editLink}
          />
        </div>

      </div>
      <button onClick={removeSocial} className="duration-300 opacity-50 hover:opacity-100">
        <Icon.X size={20} />
      </button>

    </div>
  )
}

const SocialIconDropdown = ({ type, setType }) => { 
  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button className="flex items-center justify-between w-10">
            {getIcon(type)}
            <Icon.ChevronDown
            size={20}
              className={clsx("duration-300", open ? "transform rotate-180" : "")}
            />
          </Menu.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100 origin-top"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75 origin-top"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className="absolute top-0 left-0 mt-6 w-fit flex flex-col justify-center rounded-md shadow  palette1 z-20 outline-none focus:outline-none"
            >
              {socialTypes.map((socialType, index) => (
                <Menu.Item
                  key={socialType + index}
                >
                  <button
                    className="p-2 duration-200 opacity-75 hover:opacity-100 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation()
                      setType(socialType)
                    }}
                  >
                    {getIcon(socialType)}
                  </button>
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}