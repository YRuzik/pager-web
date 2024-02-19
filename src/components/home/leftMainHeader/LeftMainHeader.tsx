
import './leftMainHeader.scss'
import {AppIcons, Icon} from "../../common/icon/Icon.tsx";
import React from "react";
import CustomInput, {InputStyles} from "../../common/customInput/CustomInput.tsx";

interface LeftMainHeaderProps {
    action: () => void;
    searchOnChange: (value: string) => void
}
const LeftMainHeader: React.FC<LeftMainHeaderProps> = ({ action, searchOnChange }) => {
    return (
        <div className={'left-main-header-wrapper'}>
            <div className={'left-main-header-menu'}>
                <Icon icon={AppIcons.burgerMenu} onClick={action}/>
            </div>
            <div className={'search-input-wrapper'}>
                <CustomInput style={InputStyles.colorizedFill} placeholder={'Поиск...'} onChanged={(e) => searchOnChange(e.currentTarget.value)}/>
            </div>
        </div>
    )
}

export default LeftMainHeader