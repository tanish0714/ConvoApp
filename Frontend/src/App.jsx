
import { Toaster } from 'react-hot-toast'
import './App.css'
import Footer from './components/Footer'
import Home from './components/Home'
import Navbar from './components/Navbar'

function App() {
 

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar/>
      <Home/>
      <Footer/>
      <Toaster/>
    </div>
  )
}

export default App
