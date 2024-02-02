import {FC} from "react";
import iBurgerMenu from '../../../assets/burger-menu.svg'
import IPencil from '../../../assets/pencil.svg'
import IXsymbol from '../../../assets/x-symbol.svg'
import ICheckMark from '../../../assets/checkmark.svg'
import ArrowBack from '../../../assets/arrow-back.svg'
import "./icon.scss"
export enum AppIcons {
    burgerMenu = iBurgerMenu,
    pencil = IPencil,
    xSymbol = IXsymbol,
    checkmark = ICheckMark,
    back = ArrowBack
}

type IconProps = {
    size?: number;
    onClick?: () => void;
    icon: AppIcons;
}

export const Icon: FC<IconProps> = ({icon, size = 36, onClick}) => {
    return (
        <div onClick={onClick} className={onClick ? "icon-button" : undefined}>
            <img src={icon} alt={icon.toString()} width={size} height={size}/>
        </div>
    )
}

export default Icon