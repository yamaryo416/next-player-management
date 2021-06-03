import { memo, useCallback, useEffect, useState, VFC } from "react";
import { Box, Flex, Link, Text, Wrap, WrapItem } from "@chakra-ui/layout";
import moment, { Moment } from "moment";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { TODAY } from "../../../../constants";
import { scheduleOneDayState } from "../../../store/scheduleOneDayState";
import { Maybe, ScheduleNodeType } from "../../../../types/queriesType";
import { TrainingIcon } from "../../molecules/TrainingIcon";
import { calendarDateState } from "../../../store/calendarDateState";

type Props = {
    schedules: {
        edges: Maybe<ScheduleNodeType[]>
    } | undefined;
}

export const Calendar: VFC<Props> = memo((props) => {
    const { schedules } = props

    const calendarDate = useRecoilValue(calendarDateState)
    const setOneDay = useSetRecoilState(scheduleOneDayState)

    const [isIconMode, setIsIconMode] = useState(true)
    const [datesOfWeek, setDatesOfWeek] = useState<Moment[]>([])

    const onChangeIsIconMode = useCallback(() => setIsIconMode(!isIconMode), [isIconMode])

    const weekSchedules = useCallback((d: moment.Moment) => 
        schedules?.edges?.
        filter(sche => sche.node.date === d.format("YYYY-MM-DD").toString()).
        map(({ node }) => (
            <WrapItem key={node.id} alignItems="center" data-testid={node.id + '-schedule-item'}>
                {isIconMode && node.training.iconNumber ? 
                    <TrainingIcon iconNumber={node.training.iconNumber} color="white" size="50px" />
                : (
                    <Text
                        maxW="130px"
                        pr={5} 
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        color="white"
                    >
                        {node.training.title}
                    </Text>
                )}
            </WrapItem>
        )
    ), [schedules, isIconMode])

    useEffect(() => {
        const dates: Moment[] = []
        let addDate = 0;
        while (addDate < 7) {
            const date = moment(calendarDate.firstDate).add(addDate, 'd')
            dates.push(date)
            addDate++
        }
        setDatesOfWeek(dates)
    }, [calendarDate.firstDate])

    return (
        <Box pt={3} mb={3}>
            <Box pb={3}>
                <Link onClick={onChangeIsIconMode} color="orange">
                    {isIconMode ? "予定を文字表記にする" : "予定をアイコン表記にする" }
                </Link>
            </Box>
            <Flex borderBottom="1px solid #718096">
                <Text >日付</Text>
                <Text pl="35px">予定</Text>
            </Flex>
            {datesOfWeek.map((date, i) => (
                <Box key={i}>
                    <Flex
                        borderBottomStyle="solid"
                        borderBottomWidth="1px"
                        borderBottomColor={date.format("YYYY-MM-DD") === TODAY ? "orange" : "#718096"}
                        onClick={() => {
                            setOneDay(date.format("YYYY-MM-DD"))
                        }}
                        alignItems="center"
                        py={3}
                    >
                        <Text
                            color={date.format("YYYY-MM-DD") === TODAY ? "orange" : "white"}
                            w={{ base: "40px", md: "60px"}}
                        >
                             {moment(calendarDate.firstDate).get("M") + 1 === date.get("M") ? date.format("M月D日") : date.format("D日")}
                        </Text>
                        <Wrap
                            ml={3}
                            w={{ base: "250px", md: "350px"}}
                        >
                             {weekSchedules(date)}
                        </Wrap>
                    </Flex>
                </Box>
            ))}
        </Box>
    )
})