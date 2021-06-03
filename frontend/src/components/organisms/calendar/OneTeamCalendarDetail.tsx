import { memo, VFC } from "react";
import { Box, Text } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";

import { scheduleOneDayState } from "../../../store/scheduleOneDayState";
import { Maybe, ScheduleNodeType } from "../../../../types/queriesType";
import { CalendarDetailMenubar } from "./CalendarDetailMenubar";
import { CalendarDetailContents } from "./CalendarDetailContents";

type Props = {
    schedules: {
        edges: Maybe<ScheduleNodeType[]>
    } | undefined;
}

export const OneTeamCalendarDetail: VFC<Props> = memo((props) => {
    const { schedules } = props

    const oneDay = useRecoilValue(scheduleOneDayState)
    
    return (
        <Box textAlign="center">
            <CalendarDetailMenubar />
         <Box py={7}>
             {schedules?.edges?.filter(sche => sche.node.date === oneDay).map(({ node }) => (
                <CalendarDetailContents node={node} />
             ))}
             {schedules?.edges?.filter(sche => sche.node.date === oneDay).length === 0 && (
                <Text>予定はありません。</Text>
             )}
         </Box>
    </Box>
    )
})