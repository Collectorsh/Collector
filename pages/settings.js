import React, { useState, useContext } from "react";
import CheckLoggedIn from "/components/CheckLoggedIn";
import MainNavigation from "/components/navigation/MainNavigation";
import Settings from "/components/settings/Settings";
import Wallets from "/components/settings/Wallets";
import { Toaster } from "react-hot-toast";

function SettingsPage() {

  return (
    <div>
      <CheckLoggedIn />
      <MainNavigation />
      <Toaster />
      <div className="relative max-w-screen-md mx-auto p-4 sm:p-8">
  
        <div className="mx-auto pt-3 md:px-0">
          <h2 className="mt-8 mb-12 text-5xl font-semibold text-gray-800 w-full py-1 inline-block dark:text-whitish">
            Account Settings
          </h2>
          
          <Settings />
    
          <hr className="mt-8 mb-4" />
          <Wallets />
        </div>
      </div>
   
    </div>
  );
}

export default SettingsPage;
