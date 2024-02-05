import ModalWindow from "../modalWindow/ModalWindow.tsx";
import {FC} from "react";

type CreateChatModal = {
    isOpen: boolean
    onClose: () => void
}

const CreateChatModal: FC<CreateChatModal> = ({isOpen, onClose}) => {
    return <ModalWindow handleClose={onClose} isOpen={isOpen} title={"Создание чата"}>
        <div>

        </div>
    </ModalWindow>
}

export default CreateChatModal