import {FC} from "react";
import iChat from '../../../assets/icons/chat.svg'
import iStream from '../../../assets/icons/stream.svg'
import iApps from '../../../assets/icons/apps.svg'
import IEmail from '../../../assets/icons/email.svg'
import IProfileName from '../../../assets/icons/profileName.svg'
import iBurgerMenu from '../../../assets/icons/burger-menu.svg'
import IPencil from '../../../assets/icons/pencil.svg'
import IXsymbol from '../../../assets/icons/close.svg'
import ICheckMark from '../../../assets/icons/checkmark.svg'
import ArrowBack from '../../../assets/icons/arrow-back.svg'
import Send from '../../../assets/icons/send.svg'
import Reply from '../../../assets/icons/reply.svg'
import Done from '../../../assets/icons/done.svg'
import DoneAll from '../../../assets/icons/done_all.svg'
import Edit from '../../../assets/icons/edit.svg'
import GroupAdd from '../../../assets/icons/group_add.svg'
import Logout from '../../../assets/icons/logout.svg'
import Settings from '../../../assets/icons/settings.svg'
import "./icon.scss"
export enum AppIcons {
    burgerMenu = iBurgerMenu,
    pencil = IPencil,
    xSymbol = IXsymbol,
    checkmark = ICheckMark,
    back = ArrowBack,
    send = Send,
    reply = Reply,
    ChatIcon=iChat,
    stream =iStream,
    apps =iApps,
    profileName = IProfileName,
    email = IEmail,
    done = Done,
    doneAll = DoneAll,
    edit = Edit,
    groupAdd = GroupAdd,
    logout = Logout,
    settings = Settings
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