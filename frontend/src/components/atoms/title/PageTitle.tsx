import { memo, ReactNode, VFC } from "react";
import { Heading } from "@chakra-ui/layout";

type Props = {
    children: ReactNode;
}

export const PageTitle: VFC<Props> = memo((props) => {
    const { children } = props;

    return (
        <Heading
            fontSize={{ base: "16px", md: "25px"}}
            textAlign="center"
            mb={5}
        >
            {children}
        </Heading>
    )
})