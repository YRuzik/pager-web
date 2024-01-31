import {FC} from "react";

export enum AppIcons {
}

type IconProps = {
    size?: number;
    onClick?: () => void;
    icon: AppIcons;
}

const Icon: FC<IconProps> = ({icon, size = 36, onClick}) => {
    return (
        <div onClick={onClick} className={onClick ? "icon-button" : undefined}>
            <img src={icon} alt={icon.toString()} width={size} height={size}/>
        </div>
    )
}

export default Icon