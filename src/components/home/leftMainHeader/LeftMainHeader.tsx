
import './leftMainHeader.scss'
const LeftMainHeader = () => {
    return (
        <div className={'left-main-header-wrapper'}>
            <div className={'left-main-header-menu'}>

            </div>
            <div className={'search-input-wrapper'}>
                <input placeholder={'search...'} className={'search-input'}/>
            </div>
        </div>
    )
}

export default LeftMainHeader