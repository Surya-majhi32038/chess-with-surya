import { useState } from "react";
import ChessBoard from "../components/ChessBoard";
import { Header } from "../components/Header";
import { Menu, X } from "lucide-react";


const Game = () => {
     const [isOpen, setIsOpen] = useState(false);
 
  return (
    <div className="flex  items-center ph:h-screen ph:flex-col lg:h-screen">
         {/* head for phone  */}
        <div className=" md:hidden ph:w-full  top-0 sticky flex justify-between px-2 py-1">
          <div className=" flex justify-between gap-1">
            {/* toggle part */}
            <div className="">
              {/* Hamburger Button */}
              <button
                className="md:hidden focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X size={35} strokeWidth={3} className="text-[#989795] " />
                ) : (
                  <Menu className="text-[#989795]" strokeWidth={3} size={35} />
                )}
              </button>
              {isOpen && <Header />}
            </div>

            {/* image part */}
            <img
              src="/icon.png"
              alt="icon of the chess.com "
              className={`w-[120px] ${isOpen? "hidden" : null} h-[34px] `}
              onClick={()=>
                window.open("https://www.chess.com/", "_self")
              }
            />
          </div>

          <div className={`flex gap-2 ${isOpen? "hidden" : null} items-center`}>
            <p className="bg-[#81B64C] text-white cursor-pointer duration-200 font-semibold text-[14px]  hover:bg-[#8abc40]  flex items-center  rounded-sm px-2 py-1 ">
              Sign up
            </p>

            <p className="  bg-[#454341] cursor-pointer text-white  duration-200 font-semibold hover:bg-[#454441] text-[14px] flex items-center rounded-sm px-2 py-1  ">
              Log out
            </p>
          </div>
        </div>
        <div className="mr-auto ph:hidden h-full sticky top-0 ">
          <Header />
        </div>
        <div className=" w-full h-full ph:flex-none  flex flex-col justify-center items-center">

            <ChessBoard /> 
        
        </div>
        
    </div>
  );
};

export default Game;
