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
      <div className="relative max-w-screen-md mx-auto 2xl:px-8 py-12">
  
        <div className="w-full">
          <h2 className="text-5xl font-semibold  w-full py-1 inline-block">
            Account Settings
          </h2>
          <hr className="mt-6 mb-12 borderPalette2" />

          <Settings />
    
          <hr className="mt-6 mb-12 borderPalette2" />
          <Wallets />
        </div>
      </div>
   
    </div>
  );
}

export default SettingsPage;
