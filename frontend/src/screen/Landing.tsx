import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";

import  {Footer}  from "../components/Footer.tsx";
import { RedBorder } from "../components/RedBorder.tsx";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center  ">
      {/* header part */}
      <div className="mr-auto h-full sticky top-0 ">
        <Header />
      </div>

      <div className="w-full flex h-auto flex-col  items-center">


        {/* front part */}
        <div className="flex mt-10 items-center  h-[500px] gap-10">
          {/* left part */}
          <div className="flex  h-auto bg-transparent">
            <img
              src="/chessBoard.jpeg"
              alt="Chessboard"
              className="w-[496px] h-[496px] max-w-full   rounded-lg shadow-lg"
            />
          </div>

          {/* right part */}

          <div className="text-white flex flex-col items-center max-w-[450px] h-auto gap-7 ">
            <p className="text-5xl font-bold text-center leading-[54px]">
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
            {/* 
                        <div className="relative flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg">
                            <span className="absolute -left-4 top-1/2 transform -translate-y-1/2">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg"
                                    alt="Chess piece"
                                    className="w-6 h-6"
                                />
                            </span>
                            <div className="ml-6 text-left">
                                <p className="text-lg">Play Online</p>
                                <p className="text-sm text-white/80">Play with someone at your level</p>
                            </div>
                        </div> */}

            <div className="bg-[#81B64C] hover:bg-[#A3D160] transition duration-300 mx-auto relative py-3 flex items-center justify-center shadow-lg w-full max-w-[400px] px-4 rounded-lg cursor-pointer before:absolute before:bottom-0 before:left-0 before:w-full before:h-1 before:bg-black/30 before:rounded-3xl">
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
                <p className="bg-transparent">
                  Play with someone at your level
                </p>
              </div>
            </div>

            {/* play Bots container */}
            <div className="bg-[#454341] hover:bg-[#4D4C49] hover:text-[#E1E1E0] text-[#C5C5C5] transition duration-300 mx-auto relative py-2 flex items-center justify-center w-full max-w-[400px] px-4 rounded-lg cursor-pointer before:absolute before:bottom-0 before:left-0 before:w-full before:h-1 before:bg-black/30 before:rounded-3xl">
              <img
                src="/bot-pik.png"
                alt="hand with pawn icon"
                className="w-[80px] bg-transparent h-[80px] object-contain"
              />
              <div
                className="text-left pl-4 bg-transparent"
                onClick={() => {
                  navigate("/");
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

        {/* first container  */}
        <div className="bg-[#262522] flex mt-16 gap-20 p-12 rounded-md">
          {/* left part */}
          <div className="flex flex-col gap-20 justify-around bg-transparent">
            {/* upper part */}
            <div className="text-white bg-transparent items-center flex flex-col gap-10">
              <p className="text-3xl  bg-transparent font-bold">
                {" "}
                Solves Chess Puzzles
              </p>
              <div className="bg-[#81B64C] hover:bg-[#A3D160] relative transition duration-300 flex items-center justify-center rounded-lg cursor-pointer before:absolute before:bottom-0 before:left-0 before:w-full before:h-1 before:bg-black/30 before:rounded-3xl">
                <p className="font-bold px-4 py-4 bg-transparent text-2xl">
                  Solves Puzzles
                </p>
              </div>
            </div>

            {/* lower part */}
            <div className="bg-transparent flex flex-row items-center gap-10">
              <img
                src="https://www.chess.com/bundles/web/images/faces/hikaru-nakamura.e1ca9267.jpg"
                className="rounded-md"
                alt=""
              />

              <div className="text-[#C3C2C1] bg-transparent w-60 flex flex-col gap-3 h-auto">
                <p className="bg-transparent">
                  "Puzzles are the best way to improve pattern recognition, and
                  no site does it better."
                </p>

                <div className="bg-transparent">
                  <RedBorder value="GM"/>
                  <span className="bg-transparent ml-1">Hikaru Nakamura</span>
                </div>
              </div>
            </div>
          </div>

          {/* right part*/}
          <div>
            <img
              src="https://www.chess.com/bundles/web/images/web/board-puzzles.4a54c49f@2x.png"
              alt=""
              className="h-[400px] w-[410px]"
            />
          </div>
        </div>

        {/* second container */}
        <div className="bg-[#262522] flex mt-8 gap-20 p-12 rounded-md">
          {/* left part */}

          <div>
            <img
              src="https://www.chess.com/bundles/web/images/web/board-lessons.825946d3@2x.png"
              alt=""
              className="h-[400px] w-[410px]"
            />
          </div>

          {/* right part*/}
          <div className="flex flex-col gap-20 justify-around bg-transparent">
            {/* upper part */}
            <div className="text-white bg-transparent items-center flex flex-col gap-10">
              <p className="text-3xl  bg-transparent font-bold">
                {" "}
                Take Chess Lessons
              </p>
              <div className="bg-[#81B64C] hover:bg-[#A3D160]  transition duration-300 flex items-center justify-center rounded-lg cursor-pointer relative before:absolute before:bottom-0 before:left-0 before:w-full before:h-1 before:bg-black/30 before:rounded-3xl">
                <p className="font-bold px-4 py-4 bg-transparent text-2xl">
                  Start Lessons
                </p>
              </div>
            </div>

            {/* lower part */}
            <div className="bg-transparent flex flex-row items-center gap-10">
              <img
                src="https://www.chess.com/bundles/web/images/faces/anna-rudolf.193d08a5.jpg"
                className="rounded-md"
                alt=""
              />

              <div className="text-[#C3C2C1] bg-transparent w-60 flex flex-col gap-3 h-auto">
                <p className="bg-transparent">
                  "Chess.com lessons make it easy to learn to play, then
                  challenge you to continue growing."
                </p>

                <div className="bg-transparent">
                <RedBorder value="IM"/>
                  <span className="bg-transparent ml-1">Anna Rudolf</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[32px] font-bold text-white my-10">
          Follow what’s happening in Chess Today.
        </div>

        {/* chess update  */}
        <div className="text-white grid grid-cols-2 gap-12">
          {/* containt No 1 */}
          <div className="cursor-pointer flex flex-col hover:text-[#D6D5D5] items-center">
            <img
              src="https://images.chesscomfiles.com/uploads/v1/news/1618358.96bea9b6.507x286o.1e9b7875c682@2x.png"
              alt=""
              className="w-[504px] h-[283px]"
            />
            <div className="flex flex-col items-center mt-5">
              <span>Lula's Experience on 'Chess Masters: The Endgame'</span>
              <div className="bg-transparent">
                <RedBorder value="FM"/>
                <span className="bg-transparent ml-1">MikeKlein</span>
              </div>
            </div>
          </div>

          {/* containt No 2 */}
          <div className="cursor-pointer flex flex-col hover:text-[#D6D5D5] items-center">
            <img
              src="https://images.chesscomfiles.com/uploads/v1/news/1624930.09ea0043.507x286o.52cf459a8d47.png"
              alt=""
              className="w-[504px] h-[283px]"
            />
            <div className="flex flex-col items-center mt-5">
              <span>Nakamura Wins Another $5,000 In American Cup Blitz</span>
              <div className="bg-transparent">
                <span className="bg-transparent ml-1">AnthonyLevin</span>
              </div>
            </div>
          </div>

          {/* containt No 3 */}
          <div className="cursor-pointer flex flex-col hover:text-[#D6D5D5] items-center">
            <img
              src="https://images.chesscomfiles.com/uploads/v1/article/31904.8b667c4a.507x286o.c1efcfa04616.png"
              alt=""
              className="w-[504px] h-[283px]"
            />
            <div className="flex flex-col items-center mt-5">
              <span>Do You Even Rook Lift, Bro?</span>
              <div className="bg-transparent">
                <span className="bg-transparent ml-1">Gserper</span>
              </div>
            </div>
          </div>

          {/* containt No 4 */}
          <div className="cursor-pointer flex flex-col items-center hover:text-[#D6D5D5] ">
            <img
              src="https://images.chesscomfiles.com/uploads/v1/video/9851.202e2ac5.507x286o.8bdc6c84f09d.png"
              alt=""
              className="w-[504px] h-[283px]"
            />
            <div className="flex flex-col items-center  mt-5">
              <span>Rare Fourth Moves</span>
              <div className="bg-transparent">
              <RedBorder value="GM"/>
                <span className="bg-transparent ml-1">JanistanTV</span>
              </div>
            </div>
          </div>
        </div>

        {/* chess button  */}

        <div>
          <p className="text-[22px] font-extrabold text-white bg-[#81B64C] hover:bg-[#A3D160] transition duration-300 mx-auto relative py-3 flex items-center justify-center shadow-lg w-full max-w-[400px] px-4 rounded-lg cursor-pointer before:absolute before:bottom-0 before:left-0 before:w-full before:h-1 before:bg-black/30 before:rounded-3xl">
            Chess Today
          </p>
        </div>

                <Footer/>
        
      </div>
    </div>
  );
};

export default Landing;
