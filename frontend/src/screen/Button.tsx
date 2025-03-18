

const Button = ({ onClick ,children } : { onClick: ()=>void, children : React.ReactNode}) => {
  return (
    <button
        onClick={onClick} 
        className="text-lg bg-green-400 text-white px-6 py-1 rounded-md font-bold ">
            {children}
    </button>
  )
}

export default Button