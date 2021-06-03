import { memo, ReactNode, VFC } from "react"
import { Box, Text } from "@chakra-ui/layout"

type Props = {
    isMyPost: boolean;
    children: ReactNode;
}

export const SpeechBallon: VFC<Props> = memo((props) => {
    const { isMyPost, children } = props

    if (isMyPost) return (
        <Box mr={5}>
            <Text
                display="inline-block"
                bg="rgb(255, 255, 0)"
                color="black"
                borderRadius={{ base: "15px" ,md: "20px"}}
                textAlign="left"
                verticalAlign="top"
                maxWidth="200px"
                py="5px"
                px={{ base: "15px", md: "20px"}}
                data-testid='my-post'
            >
                {children}
            </Text>
            <Box 
                display="inline-block"
                pos="absolute"
                transform={{
                    base: "rotate(45deg) translateY(120%) translateX(-20%)",
                    md: "rotate(45deg) translateY(150%) translateX(20%)"
                }}
                borderRight="10px solid rgb(255, 255, 0)"
                height="10px"
            />
        </Box>
    )

    return (
        <Box ml={5}>
            <Box
                display="inline-block"
                pos="absolute"
                transform={{
                    base: "rotate(45deg) translateY(60%) translateX(50%)",
                    md: "rotate(45deg) translateY(110%) translateX(70%)"
                }}
                borderRight="10px solid white"
                height="10px"
            />
            <Text
                display="inline-block"
                bg="white"
                color="black"
                borderRadius={{ base: "15px" ,md: "20px"}}
                verticalAlign="top"
                py="5px"
                px={{ base: "15px", md: "20px"}}
                maxW="200px"
                data-testid='other-post'
            >
                {children}
            </Text>
        </Box>
    )
})

