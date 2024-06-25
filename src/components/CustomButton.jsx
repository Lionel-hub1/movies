import PropTypes from "prop-types";
import { ICONS } from "../data/constants";

const CustomButton = ({ value }) => {
  return (
    <div>
      <button className="flex border-2 items-center space-x-3 border-white text-white font-bold text-2xl py-2 px-4 rounded-lg hover:bg-primaryDark hover:text-white transition duration-300 ease-in-out">
        <img className="h-10 w-10" src={ICONS.playIc} alt="" />
        <span className="text-lg lg:text-3xl">{value}</span>
      </button>
    </div>
  );
};

CustomButton.propTypes = {
  value: PropTypes.string,
};

export default CustomButton;
