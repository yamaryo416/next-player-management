import { memo, ReactNode, VFC } from "react";
import { Button } from "@chakra-ui/button";

type Props = {
    name: string;
    type: 'button' | 'submit';
    disabled: boolean;
    children: ReactNode;
    onClick: () => void | null;
}

export const DeleteButton: VFC<Props> = memo((props) => {
    const { name, type, disabled, children, onClick } = props

    return (
        <Button
            bg="red.600"
            color="white"
            borderRadius="1000px"
            disabled={disabled}
            type={type}
            onClick={onClick}
            data-testid={`${name}-button`}
        >
            {children}
        </Button>
    )
})