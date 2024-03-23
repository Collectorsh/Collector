import React, { useContext, useState } from 'react'
import Modal from '../Modal';
import MainButton, { WarningButton } from '../MainButton';
import UserContext from '../../contexts/user';
import { truncate } from '../../utils/truncate';
import mergeAccounts from '../../data/user/mergeAccounts';
import { error, success } from '../../utils/toast';
import { Oval } from 'react-loader-spinner';

const MergeAccountsModal = ({ attemptingAddress, existingUser, isOpen, onClose }) => {
  const [user, setUser] = useContext(UserContext);
  const [merging, setMerging] = useState(false);
  
  const handleClose = () => {
    onClose();
  }

  const handleMerge = async () => { 
    setMerging(true);

    const res = await mergeAccounts(user.api_key, existingUser.api_key);

    if (res?.status === "success") {
      setUser(res.user);
      success("Accounts merged successfully!");
      handleClose();
    } else {
      error(res?.msg || "Error merging accounts");
    }
    
    setMerging(false);
  }

  if (!existingUser || !user) return null;

  return (
    <Modal
      isOpen={isOpen} onClose={handleClose}
      title="Merge Accounts"
      widthClass="max-w-4xl"
    >

      <p className='text-lg font-bold mt-4'>{truncate(attemptingAddress)} is already associated with the following account</p>
      <div className='palette3 rounded-lg py-3 px-4 my-3'>
        <p><span className='font-bold'>Username:</span> {existingUser.username || "..."}</p>
        <p><span className='font-bold'>Display Name:</span> {existingUser.name || "..."}</p>
        <div className='flex flex-wrap gap-2'>
          <p className='font-bold'>Wallets:</p>
          {existingUser.public_keys.map(key => (
            <p key={key} className='palette2 px-2 rounded-md shadow textPalette2'>{truncate(key)}</p>
          ))}
        </div>

      </div>

      <p className='font-bold mt-2'>Merging will do the following:</p>
      <ul className='list-disc list-inside textPalette2'>
        <li>Transfer all curations and NFT listings to your current ({user.username}) account</li>
        <li>Permanently delete all profile information from the merged account</li>
      </ul>
      

      <p className='text-2xl font-bold text-center mt-8 mb-3'>Are you sure you want to continue?</p>


      <div className="hidden md:flex w-full justify-center flex-wrap gap-4 sm:gap-8 mt-1 sm:mt-3">
        <MainButton onClick={handleClose}  size="lg" className="w-[13.5rem]">
          Cancel
        </MainButton>
        <WarningButton onClick={handleMerge} solid size="lg" className="w-[13.5rem] flex items-center justify-center" disabled={merging}>
          {merging
            ? <Oval color="#fff" height={24} width={24} strokeWidth={3} /> 
            :"Permanently Merge"
          }
        </WarningButton>
      </div>
    </Modal>
  )
}

export default MergeAccountsModal