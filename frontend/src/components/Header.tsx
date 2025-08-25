export const Header = () => {
    return (
        <>
            {/* main div  */}
            <div className="bg-[#262522]  w-36 h-[94vh]  flex flex-col text-gray-300 font-bold text-base">
                {/* every thing div */}
                <div className="bg-transparent w-full ph:hidden cursor-pointer hover:bg-[#21201E] py-2.5 flex justify-center">
                    <img
                        src="/icon.png"
                        alt="chess icon png"
                        className="bg-transparent  h-auto w-[7vw]"
                        onClick={() => {

                        }}
                    />
                </div>

                {/*  hand with chess  */}
                <div className="bg-transparent gap-3 flex pl-4 py-2.5 justify-start cursor-pointer hover:bg-[#21201E]  items-center">
                    <img
                        src="/hand-with-chess.svg"
                        alt="hand with chess svg image "
                        className="bg-transparent w-7 h-auto "
                    />
                    <p className="bg-transparent">Play</p>
                </div>

                {/* puzlee */}
                <div className="cursor-pointer hover:bg-[#21201E] bg-transparent flex  gap-3 pl-4 py-2.5 justify-start items-center">
                    <img
                        src="/puzlee.png"
                        alt="hand with chess svg image "
                        className="bg-transparent w-7 scale-150 h-auto "
                    />
                    <p className="bg-transparent">Puzzles</p>
                </div>

                {/* learn */}
                <div className="cursor-pointer hover:bg-[#21201E] bg-transparent flex  gap-3 pl-4 py-2.5 justify-start items-center">
                    <img
                        src="/lessons.svg"
                        alt="hand with chess svg image "
                        className="bg-transparent w-7 h-auto "
                    />
                    <p className="bg-transparent">Learn</p>
                </div>

                {/* Watch */}
                <div className="cursor-pointer hover:bg-[#21201E] bg-transparent flex  gap-3 pl-4 py-2.5 justify-start items-center">
                    <img
                        src="/watch.svg"
                        alt="hand with chess svg image "
                        className="bg-transparent w-7 h-auto "
                    />
                    <p className="bg-transparent">Watch</p>
                </div>

                {/* News */}
                <div className="cursor-pointer hover:bg-[#21201E] bg-transparent flex  gap-3 pl-4 py-2.5 justify-start items-center">
                    <img
                        src="/newspaper.svg"
                        alt="hand with chess svg image "
                        className="bg-transparent w-7 h-auto "
                    />
                    <p className="bg-transparent">News</p>
                </div>

                {/* social */}
                <div className="cursor-pointer hover:bg-[#21201E] bg-transparent flex  gap-3 pl-4 py-2.5 justify-start items-center">
                    <img
                        src="/friend.svg"
                        alt="hand with chess svg image "
                        className="bg-transparent w-7 h-auto "
                    />
                    <p className="bg-transparent">Social</p>
                </div>

                {/* more */}
                <div className="cursor-pointer hover:bg-[#21201E] bg-transparent flex  gap-3 pl-4 py-2.5 justify-start items-center">
                    <img
                        src="/more.svg"
                        alt="hand with chess svg image "
                        className="bg-transparent w-7 h-auto "
                    />
                    <p className="bg-transparent">More</p>
                </div>

                {/* SEARCH BAR */}
                <div className="bg-transparent text-base font-normal w-full px-2">
                    <input
                        type="text"
                        className="w-full border-2 border-gray-500 px-3 py-1 bg-[#373633] text-white rounded-md focus:outline-none"
                        placeholder="Search"
                    />
                </div>

                {/* sign up */}
                <div className=" w-full px-3 pt-6 bg-transparent">
                    <p className="bg-[#7ca43f] justify-center text-gray-300 cursor-pointer duration-200  hover:bg-[#8abc40] items-center flex py-2 rounded-md">
                        Sign up
                    </p>
                </div>

                {/* log out */}
                <div className=" w-full px-3 pt-2 bg-transparent">
                    <p className=" justify-center cursor-pointer text-gray-400 duration-200  hover:bg-[#454441] items-center flex py-2 rounded-md">
                        Log out
                    </p>
                </div>

                {/* footer part */}
                <div className="mt-auto bg-[#262522] text-[#989795] text-xs w-full mb-4 flex flex-col ">
                    <div className="flex hover:bg-[#21201E] hover:text-white pl-4 pb-3 cursor-pointer w-full bg-transparent items-center gap-2">
                        <img src="/support.png" className="bg-transparent w-6 h-auto" alt="language option" />
                        <span className=" bg-transparent ">English</span>
                    </div>
                    <div className="flex hover:bg-[#21201E] hover:text-white pl-4 pb-3 cursor-pointer bg-transparent items-center gap-2">
                        <img src="/questionMark.png" className="bg-transparent  w-6 h-auto" alt="language option" />
                        <span className=" bg-transparent ">Support</span>
                    </div>
                </div>


            </div>
        </>
    );
};
