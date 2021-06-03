import { ChangeEvent, memo, VFC } from "react";
import { Input } from "@chakra-ui/input";

type Props = {
    name: string;
    type: string;
    value: string | number | undefined;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void; 
}

export const CustomInput: VFC<Props> = memo((props) => {
    const { name, type, value, placeholder, onChange } = props

    return (
        <Input
            type={type}
            value={value}
            borderColor="gray.400"
            borderRadius="1000px"
            placeholder={placeholder}
            data-testid={`${name}-form`}
            onChange={onChange}
        />
    )
})