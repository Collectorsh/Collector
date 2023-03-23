import React, { useState, useContext, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import CheckLoggedIn from "/components/CheckLoggedIn";
import MainNavigation from "/components/navigation/MainNavigation";
import UserContext from "/contexts/user";

export default function CuratorHub() {
  const router = useRouter();
  const [user] = useContext(UserContext);

  useEffect(() => {
    if (!user) return;
    if (!user.can_mint) router.push("/");
  }, [user]);

  return (
    <div>
      <CheckLoggedIn />
      <MainNavigation />
      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-8">
        <div className="mx-auto clear-both">
          <div className="mx-auto pt-3 md:px-0">
            <h2 className="mt-8 mb-12 text-5xl font-semibold text-gray-800 w-full py-1 inline-block dark:text-white">
              Create
            </h2>
            <div className="w-full border-b border-gray-200 dark:border-dark3 pb-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
