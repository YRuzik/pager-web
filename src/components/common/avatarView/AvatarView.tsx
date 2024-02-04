import {FC} from "react";
import './avatarView.scss'

type AvatarViewProps = {
    online: boolean
    size?: number
}

const AvatarView: FC<AvatarViewProps> = ({online, size = 50}) => {
    return (
        <div className={"avatar-wrapper"} style={{height: size, width: size}}>
            <div className={`avatar-img ${online && "crop-avatar"}`}></div>
            {online && <div className={"avatar-online"}></div>}
        </div>
    )
}

export default AvatarView