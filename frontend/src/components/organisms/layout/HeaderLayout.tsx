import { Box, Flex } from '@chakra-ui/layout'
import { memo, ReactNode, VFC } from 'react'

type Props = {
    children: ReactNode
}

export const HeaderLayout: VFC<Props> = memo((props) => {
    const { children } = props;
    return (
        <Box pos="fixed" bg="gray.800" width="100%" height="80px" as="nav" zIndex="10">
            <Flex
                justify="space-between"
                align="center"
                wrap="wrap"
                bg="black"
                px={{ base: 5, md: 10 }}
                color="white"
                lineHeight="80px"
                fontSize={{ md: "16px"}}
            >
                {children}
            </Flex>
        </Box>
    )
})
