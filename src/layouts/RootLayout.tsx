import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100" >
      <Navbar />
      <div className="container mx-auto p-8 font-sans">
        <Outlet />
      </div>
    </div>
  )
}

export default RootLayout