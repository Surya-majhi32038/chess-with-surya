import { useState } from "react";
import { Menu, X } from "lucide-react";

const Test = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">MyApp</h1>

        {/* Hamburger Button */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links (Desktop) */}
        <ul className="hidden md:flex space-x-6">
          <li><a href="#" className="hover:text-gray-400">Home</a></li>
          <li><a href="#" className="hover:text-gray-400">About</a></li>
          <li><a href="#" className="hover:text-gray-400">Services</a></li>
          <li><a href="#" className="hover:text-gray-400">Contact</a></li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden mt-4 space-y-2 bg-gray-800 p-4 rounded-lg">
          <li><a href="#" className="block p-2 hover:bg-gray-700">Home</a></li>
          <li><a href="#" className="block p-2 hover:bg-gray-700">About</a></li>
          <li><a href="#" className="block p-2 hover:bg-gray-700">Services</a></li>
          <li><a href="#" className="block p-2 hover:bg-gray-700">Contact</a></li>
        </ul>
      )}
    </nav>
  );
};

export default Test;
