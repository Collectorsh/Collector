import MainNavigation from "./navigation/MainNavigation";

export default function NotFound() { 
  return (
    <>
      <MainNavigation />
      <div className="w-full h-screen flex justify-center pb-20 items-center">
        <h1>404</h1>
      </div>
    </>
  )
}