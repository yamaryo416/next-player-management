import { memo, ReactNode, VFC } from "react"
import { Box } from "@chakra-ui/layout"

type Props = {
    width: string;
    children: ReactNode;
}

export const SectionCard: VFC<Props> = memo((props) => {
    const { width ,children } = props;

    return (
        <Box 
            w={{ base: "350px", md: width }}
            pt={5}
            pb={10}
            px={4}
            mb="30px"
            mr="30px"
            ml={{ base: "20px", md: "0px"}}
            borderColor="gray.600"
            bg="rgb(10, 10, 10)"
            borderStyle="solid" 
            borderWidth="1px" 
            fontSize={{ md: "16px"}}
        >
            {children}
        </Box>
    )
})