import {FC, ReactNode, useEffect, useRef} from "react";
import './popup.scss'
type PopupProps = {
    actions: ReactNode
    isOpen: boolean
    onClose: () => void
}

const Popup: FC<PopupProps> = ({isOpen, actions, onClose}) => {
    const popupRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (popupRef !== null && isOpen) {
            const listener = (e: MouseEvent) => {
                if (e.target?.contains(popupRef.current) && e.target !== popupRef.current) {
                    onClose()
                }
            }
            document.addEventListener("click", listener)
            return () => {
                document.removeEventListener("click", listener)
            }
        }
    }, [onClose, isOpen]);
    return <>
        {
            isOpen && <div ref={popupRef} className={'popup-content'}>
                {actions}
            </div>
        }
    </>
}

export default Popup