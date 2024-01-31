
import './leftMainHeader.scss'
import {AppIcons, Icon} from "../../common/icon/Icon.tsx";
import React from "react";

interface LeftMainHeaderProps {
    action: () => void;
}
const LeftMainHeader: React.FC<LeftMainHeaderProps> = ({ action }) => {
    return (
        <div className={'left-main-header-wrapper'}>
            <div className={'left-main-header-menu'}>
                <Icon icon={AppIcons.burgerMenu} onClick={action}/>
            </div>
            <div className={'search-input-wrapper'}>
                <input placeholder={'search...'} className={'search-input'}/>
            </div>
        </div>
    )
}

export default LeftMainHeader