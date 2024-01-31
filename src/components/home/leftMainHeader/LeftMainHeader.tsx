import './leftMainHeader.scss'
import {FC} from "react";

type LeftMainHeaderProps = {
    searchOnChange: (val: string) => void
}

const LeftMainHeader: FC<LeftMainHeaderProps> = ({searchOnChange}) => {
    return (
        <div className={'left-main-header-wrapper'}>
            <div className={'left-main-header-menu'}>

            </div>
            <div className={'search-input-wrapper'}>
                <input placeholder={'search...'} className={'search-input'}
                       onChange={(e) => searchOnChange(e.currentTarget.value)}/>
            </div>
        </div>
    )
}

export default LeftMainHeader