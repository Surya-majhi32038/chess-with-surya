import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Bounce, ToastContainer } from 'react-toastify'
// see and understand the frontend part 
createRoot(document.getElementById('root')!).render(
  <>
  <ToastContainer
    position="top-center"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    transition={Bounce}
    toastClassName="bg-white"
  />
    <App />
  </>,
)
