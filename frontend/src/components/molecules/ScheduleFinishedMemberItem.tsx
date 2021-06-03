import { memo, VFC } from "react";
import { Flex, Text } from "@chakra-ui/layout";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { ProfileNodeType } from "../../../types/queriesType";

type Props = {
    isFinished: boolean;
    nickname: string;
}

export const ScheduleFinishedMemberItem: VFC<Props> = memo((props) => {
    const { isFinished, nickname } = props

    return (
        <Flex alignItems="center" mb={3}>
            <AccountCircleIcon style={{ fontSize: 40 }} />
            <Text pl={2} data-testid={isFinished ? 'finished-schedule-member-nickname' : 'not-finished-schedule-member-nickname'}>{nickname}</Text>
        </Flex>
    )
})