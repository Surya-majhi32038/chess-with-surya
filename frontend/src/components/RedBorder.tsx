export const RedBorder = ({value} : {value:any}) => {
    // console.log(typeof value)
  return (
    <span className="text-white text-xs rounded-sm font-bold bg-[#7C2929] py-[1px] px-[2px]">
      {value}
    </span>
  );
};
