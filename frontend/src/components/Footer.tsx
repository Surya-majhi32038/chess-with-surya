import {
  faAndroid,
  faApple,
  faDiscord,
  faTiktok,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export const Footer = () => {
  return (
    <footer className="mt-10 mb-5">
      <div className="text-[#8D8C8A] text-xs  flex flex-col items-center">
      <div className="flex items-center flex-wrap justify-center text-nowrap gap-2 h-auto font-medium text-gray-400 text-sm">
          <p className="hover:text-white cursor-pointer">Support</p>
          <span className="text-lg leading-none">•</span>
          <p className="hover:text-white cursor-pointer">Chess Terms</p>
          <span className="text-lg leading-none">•</span>
          <p className="hover:text-white cursor-pointer">About</p>
          <span className="text-lg leading-none">•</span>
          <p className="hover:text-white cursor-pointer">Students</p>
          <span className="text-lg leading-none">•</span>
          <p className="hover:text-white cursor-pointer">Jobs</p>
          <span className="text-lg leading-none">•</span>
          <p className="hover:text-white cursor-pointer">Developers</p>
          <span className="text-lg leading-none">•</span>
          <p className="hover:text-white cursor-pointer">User Agreement</p>
          <span className="text-lg leading-none">•</span>
          <p className="hover:text-white cursor-pointer">Privacy Policy</p>
          <span className="text-lg leading-none">•</span>
          <p className="hover:text-white cursor-pointer">Privacy Settings</p>
          <span className="text-lg leading-none">•</span>
          <p className="hover:text-white cursor-pointer">Fair Play</p>
          <span className="text-lg leading-none">•</span>
          <p className="hover:text-white cursor-pointer">Partners</p>
          <span className="text-lg leading-none">•</span>
          <p className="hover:text-white cursor-pointer">Compliance</p>
          <span className="text-lg leading-none">•</span>
          <p className="hover:text-white cursor-pointer">Surya Majhi ( copy of Chess.com ) © 2025</p>
        </div>



        {/* different social media platform */}

        <div className="flex mt-5 items-center  space-x-2 text-[#989795]">
          <FontAwesomeIcon
            className="text-2xl ph:w-[28px] ph:h-[28px] hover:text-white cursor-pointer transition duration-300"
            icon={faApple}
            onClick={() =>
              window.open("https://www.chess.com/play/apps/ios", "_self")
            }
          />

          <FontAwesomeIcon
            className="text-2xl ph:w-[28px] ph:h-[28px] hover:text-green-500 cursor-pointer transition duration-300"
            icon={faAndroid}
            onClick={() =>
              window.open("https://www.chess.com/play/apps/android", "_self")
            }
          />

          {/* Divider Line */}
          <div className="h-6 w-px bg-gray-500"></div>
          <FontAwesomeIcon
            className="text-3xl ph:w-[28px] ph:h-[28px] hover:text-white cursor-pointer transition duration-300"
            icon={faTiktok}
            onClick={() =>
              window.open("https://www.tiktok.com/notfound", "_self")
            }
          />

          <FontAwesomeIcon
            className="text-3xl ph:w-[28px] ph:h-[28px] hover:text-white cursor-pointer transition duration-300"
            icon={faXTwitter}
            onClick={() =>
              window.open("https://x.com/chesscom", "_self")
            }
          />
          <FontAwesomeIcon
            icon={faYoutube}
            className="text-3xl ph:w-[28px] ph:h-[28px] hover:text-red-600 cursor-pointer transition duration-300"
            onClick={() =>
              window.open("https://www.youtube.com/user/wwwChesscom", "_self")
            }
          />

          <i
            className="fa fa-twitch ph:w-[28px] ph:h-[28px] text-2xl hover:text-purple-500 cursor-pointer"
            onClick={() =>
              window.open("https://www.twitch.tv/chess", "_self")
            }
          ></i>
          <i
            className="fa fa-instagram ph:w-[28px] ph:h-[28px] text-2xl hover:text-pink-600 cursor-pointer"
            onClick={() =>
              window.open("https://www.instagram.com/wwwchesscom/#", "_self")
            }
          ></i>
          {/* <i className="fa fa-discord text-2xl hover:text-blue-500 cursor-pointer"></i> */}
          <FontAwesomeIcon
            className="text-3xl ph:w-[28px] ph:h-[28px] hover:text-blue-700 cursor-pointer transition duration-300"
            icon={faDiscord}
            onClick={() =>
                window.open("https://discord.com/invite/3VbUQME", "_self")
              }
          />
        </div>
      </div>
    </footer>
  );
};
