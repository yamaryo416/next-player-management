import { memo, VFC } from "react"
import { Box, Flex, Link } from "@chakra-ui/layout"
import moment from "moment"
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import { useCalendar } from "../../../hooks/useCalendar"
import { useRecoilValue } from "recoil";
import { calendarDateState } from "../../../store/calendarDateState";
import { SectionTitle } from "../../atoms/title/SectionTitle";

export const CalendarMenubar: VFC = memo(() => {
    const calendarDate = useRecoilValue(calendarDateState)

    const {
        onClickLastWeek,
        onClickThisWeek,
        onClickNextWeek
    } = useCalendar();

    return (
        <>
            <Flex justify="flex-end" mb={3}>
                <Link onClick={onClickThisWeek} color="orange" data-testid='this-week'>今週</Link>
            </Flex>
            <Flex justifyContent="space-between">
                <Box>
                    <ArrowBackIosIcon onClick={onClickLastWeek} data-testid='last-week' />
                </Box>
                <Box>
                    <SectionTitle>
                        {moment(calendarDate.firstDate).get("M") + 1}月
                        { calendarDate.todayDiff < 0 ? `(${Math.abs(calendarDate.todayDiff).toString()}週前)` : null }
                        { calendarDate.todayDiff === 0 ? "(今週)" : null}
                        { calendarDate.todayDiff > 0 ? `(${calendarDate.todayDiff.toString()}週後)` : null }
                    </SectionTitle>
                </Box>
                <Box>
                    <Box>
                        <ArrowForwardIosIcon onClick={onClickNextWeek} data-testid='next-week' />
                    </Box>
                </Box>
            </Flex>
        </>
    )
})