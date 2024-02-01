import './leftMainHeader.scss'
import {FC} from "react";
import CustomInput, {InputStyles} from "../../common/customInput/CustomInput.tsx";

type LeftMainHeaderProps = {
    searchOnChange: (val: string) => void
}

const LeftMainHeader: FC<LeftMainHeaderProps> = ({searchOnChange}) => {
    return (
        <div className={'left-main-header-wrapper'}>
            <div className={'left-main-header-menu'}>

            </div>
            <div className={'search-input-wrapper'}>
                <CustomInput style={InputStyles.colorizedFill} placeholder={'Поиск...'} onChanged={(e) => searchOnChange(e.currentTarget.value)}/>
            </div>
        </div>
    )
}

export default LeftMainHeader