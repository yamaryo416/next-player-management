import { memo, VFC } from "react";
import { Box, Text } from "@chakra-ui/layout";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

type Props = {
    nickname: string;
}

export const PostMemberItem: VFC<Props> = memo((props) => {
    const { nickname } = props

    return (
        <Box textAlign="center">
            <AccountCircleIcon />
            <Text w={{ base: "60px", md: "80px"}}>{nickname}</Text>
        </Box>
    )
})