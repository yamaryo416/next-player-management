import { memo, ReactNode, VFC } from "react"
import { Button } from "@chakra-ui/button"

type Props = {
    name: string;
    type: "button" | "submit";
    disabled: boolean;
    onClick: () => void | null;
    children: ReactNode;
}

export const PrimaryButton: VFC<Props> = memo((props) => {
    const { name, type, disabled, onClick, children } = props
    return (
        <Button
            disabled={disabled}
            type={type}
            bg="blue.500"
            borderRadius="1000px"
            px={5}
            color="white"
            data-testid={name + '-button'}
            onClick={onClick}
         >
            {children}
        </Button>
    )
})
