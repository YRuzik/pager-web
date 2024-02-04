import {FC} from "react";
import iBurgerMenu from '../../../assets/burger-menu.svg'
import IPencil from '../../../assets/pencil.svg'
import IXsymbol from '../../../assets/x-symbol.svg'
import ICheckMark from '../../../assets/checkmark.svg'
import ArrowBack from '../../../assets/arrow-back.svg'
import Send from '../../../assets/send.svg'
import Reply from '../../../assets/reply.svg'
import Done from '../../../assets/done.svg'
import DoneAll from '../../../assets/done_all.svg'
import "./icon.scss"
export enum AppIcons {
    burgerMenu = iBurgerMenu,
    pencil = IPencil,
    xSymbol = IXsymbol,
    checkmark = ICheckMark,
    back = ArrowBack,
    send = Send,
    reply = Reply,
    done = Done,
    doneAll = DoneAll
}

type IconProps = {
    size?: number;
    onClick?: () => void;
    icon: AppIcons;
    className?: string;
}

export const Icon: FC<IconProps> = ({icon, size = 36, onClick, className}) => {
    return (
        <div onClick={onClick} className={onClick ? "icon-button" : undefined}>
            <img src={icon} alt={icon.toString()} width={size} height={size} className={className}/>
        </div>
    )
}

export default Icon