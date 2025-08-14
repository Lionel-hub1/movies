import PropTypes from "prop-types";
import { ICONS } from "../data/constants";

const CustomButton = ({
  value,
  onClick,
  icon = ICONS.playIc,
  variant = "primary",
  size = "md",
  disabled = false,
  className = ""
}) => {
  // Size styles
  const sizeClasses = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-lg",
    lg: "py-3 px-6 text-xl"
  };

  // Variant styles
  const variantClasses = {
    primary: "bg-primary hover:bg-opacity-80 text-white",
    secondary: "border-2 border-white text-white hover:bg-primaryDark hover:text-white",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white"
  };

  // Icon sizes
  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-10 w-10"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        flex items-center justify-center space-x-2 font-bold rounded-lg 
        transition duration-300 ease-in-out
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {icon && <img className={iconSizes[size]} src={icon} alt="" />}
      <span>{value}</span>
    </button>
  );
};

CustomButton.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  className: PropTypes.string
};

export default CustomButton;
