import { memo, ReactNode, VFC } from "react"
import { Button } from "@chakra-ui/button"

type Props = {
    onClick: () => void;
    children: ReactNode;
}

export const SecondaryButton: VFC<Props> = memo((props) => {
    const { onClick, children } = props
    return (
        <Button
            bg="gray.500"
            borderRadius="1000px"
            color="white"
            _hover={{
                opacity: 0.7
            }}
            onClick={onClick}
        >
            {children}
        </Button>
    )
})