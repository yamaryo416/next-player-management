import { memo, VFC } from "react";
import { Center } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";

export const CustomSpinner: VFC = memo(() => {
    return (
        <Center>
            <Spinner />
        </Center>
    )
})