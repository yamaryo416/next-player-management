import { memo, ReactNode, VFC } from "react";
import { Box } from "@chakra-ui/layout";

type Props = {
    text: string;
    onClick: () => void;
    children: ReactNode;
}

export const MenuListItem: VFC<Props> = memo((props) => {
    const { text, onClick, children} = props;

    return (
        <Box
            lineHeight="40px"
            onClick={onClick}
        >
            {children}
            {text}
        </Box>
    )
})