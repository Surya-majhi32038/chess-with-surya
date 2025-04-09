import { useRef } from "react";
type ModalProps = {
    onClose: () => void;
    h1Tag: string;
    p1: string;
    p2: string;
  };
function Modal({ onClose,h1Tag,p1,p2 }:ModalProps ) {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeModal = (e: React.MouseEvent) => { 
        if(modalRef.current === e.target) {
            onClose();
        }
    }

  return (
    <div
        ref={modalRef} onClick={closeModal}
     className='fixed inset-0  bg-black backdrop-blur-sm bg-opacity-30 ph:px-3 flex justify-center items-center z-50'
    >
    <div className='bg-indigo-600 rounded-md'>
        <div className='flex flex-col justify-center bg-transparent items-center p-10 rounded-lg'>
            <h1 className='text-2xl font-bold bg-transparent text-white'>{h1Tag}</h1>
            <p className='text-white font-mono bg-transparent'>{p1}</p>
            <p onClick={onClose} className='bg-black text-white font-serif  px-4 py-2 rounded mt-4 cursor-pointer hover:bg-white hover:text-indigo-600'>{p2}</p>
        </div>
    </div>
    </div>
  )
}

export default Modal