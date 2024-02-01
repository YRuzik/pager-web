import {FC, ReactNode} from "react";
import "./customButton.scss"

export enum ButtonStyles {
    outlinedButtonMax = "outlined-button max-width",
    outlinedButtonDefault = "outlined-button base-width",
    outlinedButtonMin = "outlined-button min-width",

    elevatedButtonMax = "elevated-button max-width",
    elevatedButtonDefault = "elevated-button base-width",
    elevatedButtonMin = "elevated-button min-width"
}

type CustomButtonProps = {
    children: ReactNode;
    style?: ButtonStyles;
    onClick: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

const CustomButton: FC<CustomButtonProps> = ({
                                                 children,
                                                 onClick,
                                                 type = "button",
                                                 style = ButtonStyles.elevatedButtonDefault,
                                                 disabled = false
                                             }) => {
    return <button type={type} onClick={() => onClick()} disabled={disabled}
                   className={`base-button ${style}`}>{children}</button>
}

export default CustomButton