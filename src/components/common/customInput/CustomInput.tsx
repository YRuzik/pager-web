import {ChangeEventHandler, FC, Ref} from "react";

import "./customInput.scss"

export enum InputStyles {
    underline = "underline-input",
    fill = "fill-input",
    colorizedFill = "colorized-input"
}

type CustomInputProps = {
    placeholder?: string
    style?: InputStyles
    onChanged?: ChangeEventHandler<HTMLInputElement>
    value?: string | readonly string[] | number
    type?: "number" | "password" | "text" | "tel" | "email",
    innerRef?: Ref<HTMLInputElement>
    disabled?: boolean
}

const CustomInput: FC<CustomInputProps> = (
    {
        placeholder,
        innerRef,
        onChanged,
        type = "text",
        value,
        style = InputStyles.underline,
        disabled = false
    }
) => <input placeholder={placeholder} disabled={disabled} ref={innerRef} onChange={onChanged} type={type} value={value}
            className={`base-input ${style}`}/>

export default CustomInput