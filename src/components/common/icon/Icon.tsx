import {FC} from "react";
import iBurgerMenu from '../../../assets/burger-menu.svg'
import iPencil from '../../../assets/pencil.svg'
import iXsymbol from '../../../assets/x-symbol.svg'
import iCheckMark from '../../../assets/checkmark.svg'
import ArrowBack from '../../../assets/arrow-back.svg'
import iChat from '../../../assets/chat.svg'
import iStream from '../../../assets/stream.svg'
import iApps from '../../../assets/apps.svg'
import IEmail from '../../../assets/email.svg'
import IProfileName from '../../../assets/profileName.svg'
import "./icon.scss"
export enum AppIcons {
    burgerMenu = iBurgerMenu,
    pencil = iPencil,
    xSymbol = iXsymbol,
    checkmark = iCheckMark,
    back = ArrowBack,
    ChatIcon=iChat,
    stream =iStream,
    apps =iApps,
    profileName = IProfileName,
    email = IEmail
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