import { useNavigate } from "react-router-dom"

const Landing = () => {
    const navigate = useNavigate();
    return (
        <div className="flex my-10 md:flex-row flex-col-reverse justify-center items-center mx-6 ">
            {/* left part */}
            <div className="flex  justify-center">
                <img src={"/chessBoard.jpeg"} alt="chees board photo" className="  w-[80%] md:w-[70%] md:mt-0 mt-10" />
            </div>


            {/* right part */}
            <div className="text-white flex flex-col gap-7 ">
                <p className="text-5xl font-bold text-center ">Play Chess Online on the #1 Site!</p>
                <div className="bg-[#7ca43f] hover:bg-[#88b841] transition duration-300 mx-auto relative py-4 flex items-center justify-center w-full max-w-[400px] px-4 rounded-lg cursor-pointer ">
                    <img src="/hand-with-chess.svg" alt="hand with pawn icon" className="w-[80px] bg-transparent h-[80px] object-contain" />
                    <div className="text-left pl-4 bg-transparent" onClick={()=>{
                        navigate("/game");
                    }}>
                        <p className="font-bold bg-transparent text-3xl">Play Online</p>
                        <p className="bg-transparent ">Play with someone at your level</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Landing