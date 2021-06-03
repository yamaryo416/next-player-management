import { memo, VFC } from "react";
import { Center, Heading } from "@chakra-ui/layout";

export const FailedText: VFC = memo(() => {
    return (
        <Center>
            <Heading fontSize="20px">データの取得に失敗しました。</Heading>
        </Center>
    )
})