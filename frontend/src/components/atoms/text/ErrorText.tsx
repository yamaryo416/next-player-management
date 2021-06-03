import { memo, VFC } from "react"
import { Text } from "@chakra-ui/layout"

type Props = {
    children: string;
}

export const ErrorText: VFC<Props> = memo((props) => {
    const { children } = props

    return (
       <Text
            color="red.600"
        >
                {children}
        </Text>
    )
})

