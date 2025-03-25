import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center  ">
      {/* header part */}
      <div className="mr-auto h-full sticky top-0 ">
        <Header />
      </div>

      <div className="w-full flex h-full  justify-center ">
        <div className="flex mt-10 gap-10">
          {/* left part */}
          <div className="flex  min-h-screen bg-transparent">
            <img
              src="/chessBoard.jpeg"
              alt="Chessboard"
              className="w-[496px] h-[496px] max-w-full   rounded-lg shadow-lg"
            />
          </div>

          {/* right part */}
          <div className="text-white flex flex-col items-center max-w-[30vw] h-auto gap-7 ">
            <p className="text-5xl font-bold text-center ">
              Play Chess Online on the #2 Site!
            </p>
            <div className="flex  justify-evenly w-full">
              <div className="flex gap-1">
                <p className="font-bold">12,123,000</p>
                <span className="text-[#989795]">Games Today</span>
              </div>
              <div className="flex gap-1">
                <p className="font-bold">123,786</p>
                <span className="text-[#989795]">Playing Now</span>
              </div>
            </div>

            {/* play online container */}
            <div className="bg-[#81B64C] hover:bg-[#A3D160] transition duration-300 mx-auto relative py-3 flex items-center justify-center w-full max-w-[400px] px-4 rounded-lg cursor-pointer ">
              <img
                src="/hand-with-chess.svg"
                alt="hand with pawn icon"
                className="w-auto bg-transparent h-[50px] object-contain"
              />
              <div
                className="text-left pl-4 bg-transparent"
                onClick={() => {
                  navigate("/game");
                }}
              >
                <p className="font-bold bg-transparent text-3xl">Play Online</p>
                <p className="bg-transparent ">
                  Play with someone at your level
                </p>
              </div>
            </div>



            {/* play Bots container */}
            <div className="bg-[#454341] hover:bg-[#4D4C49] hover:text-[#E1E1E0] text-[#C5C5C5] transition duration-300 mx-auto relative py-2 flex items-center justify-center w-full max-w-[400px] px-4 rounded-lg cursor-pointer ">
              <img
                src="/bot-pik.png"
                alt="hand with pawn icon"
                className="w-[80px] bg-transparent h-[80px] object-contain"
              />
              <div
                className="text-left pl-4 bg-transparent"
                onClick={() => {
                  navigate("/game");
                }}
              >
                <p className="font-bold bg-transparent text-3xl">Play Bots</p>
                <p className="bg-transparent ">
                  Play vs costomizable training bots
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
