import {FC, ReactNode} from "react";
import './listTile.scss'

type ListTileProps = {
    children: ReactNode
    onClick: () => void
    isSelected: boolean
}

const ListTile:FC<ListTileProps> = ({children, onClick, isSelected}) => {
    return (
        <button className={`listTile-wrapper ${isSelected && "listTile-selected"}`} onClick={() => onClick()}>
            {children}
        </button>
    )
}

export default ListTile