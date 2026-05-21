import Navbar from "./Navbar"
import Footer from "./Footer"
import Loader from './ui/loader'
import { Outlet } from "react-router-dom";
import {Suspense} from 'react'
import { useSelector } from 'react-redux'
import { useAppSelector } from "../hooks/useAppStore";
export default function Layout() {
    const { isLoading } = useAppSelector(state => state.auth);

  // ✅ لحد ما onAuthStateChanged يخلص
  if (isLoading) return <Loader />;
  return (
 

         <div className="flex flex-col min-h-screen"> 
    
    
   <Navbar />
   
     <Suspense fallback={<Loader/>} >
     <main className="container mx-auto py-8 flex-1">
    <Outlet />
    </main>
    </Suspense>
   <Footer />
   </div> 


  )
}