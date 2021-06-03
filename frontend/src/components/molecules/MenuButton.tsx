import { memo, ReactNode, VFC } from "react"
import { Box, Heading } from "@chakra-ui/layout"

type Props = {
    title: string;
    onClick: () => void;
    children: ReactNode;
}

export const MenuButton: VFC<Props> = memo((props) => {
    const { title, onClick, children } = props;
    return (
        <div>
            <Box 
                textAlign="center"
                py={3}
                px={3}
                onClick={() => onClick()}
            >
                <Box>
                    {children}
                </Box>
                <Heading fontSize="13px" as="h4">{title}</Heading>
            </Box>
        </div>
    )
})
