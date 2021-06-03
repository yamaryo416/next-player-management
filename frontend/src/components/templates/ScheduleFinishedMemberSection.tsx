import { memo, useMemo, VFC } from "react";
import { Box, Flex, Stack, Text } from "@chakra-ui/layout";
import moment from "moment";
import { useRecoilValue } from "recoil";

import { useGetMyTeamFinishedSchedules } from "../../hooks/queries/useGetMyTeamFinishedSchedules";
import { scheduleFinishedModalState } from "../../store/scheduleFinishedModalState";
import { SectionTitle } from "../atoms/title/SectionTitle";
import { SectionCard } from "../organisms/layout/SectionCard";
import { useGetMyTeamMember } from "../../hooks/queries/useGetMyTeamMember";
import { FailedText } from "../atoms/text/FailedText";
import { CustomSpinner } from "../atoms/spinner/CustomSpinner";
import { ScheduleFinishedMemberItem } from "../molecules/ScheduleFinishedMemberItem";


export const ScheduleFinishedMemberSection: VFC = memo(() => {
    const scheduleFinishedModal = useRecoilValue(scheduleFinishedModalState)
    const { loadingMyTeamFinishedSchedules, dataMyTeamFinishedSchedules, errorMyTeamFinishedSchedules } = useGetMyTeamFinishedSchedules()
    const { loadingMyTeamMember, dataMyTeamMember, errorMyTeamMember } = useGetMyTeamMember()

    const scheduleFinishedMemberId = useMemo(() => 
       dataMyTeamFinishedSchedules?.myTeamFinishedSchedules.edges?.
            filter(({ node }) => node.schedule.id === scheduleFinishedModal.id ).
            map(({ node }) => node.profile.id)
    , [dataMyTeamFinishedSchedules, scheduleFinishedModal])

    return (
        <SectionCard width="400px">
            <SectionTitle>Schedule Finished Member</SectionTitle>
            {loadingMyTeamFinishedSchedules || loadingMyTeamMember ? (
                <CustomSpinner />
            ): (
                <>
                    {(errorMyTeamFinishedSchedules || errorMyTeamMember) && <FailedText />}
                    <Stack spacing={5} mb={10}>
                        <Flex>
                            <Text>スケジュール:</Text>
                            <Text pl={3} data-testid='selected-schedule-finished-title'>{scheduleFinishedModal.title}</Text>
                        </Flex>
                        <Flex>
                            <Text>日付:</Text>
                            <Text pl={3} data-testid='selected-schedule-finished-date'>{moment(scheduleFinishedModal.date).format("YYYY年M月D日")}</Text>
                        </Flex>
                    </Stack>
                    <SectionTitle>Finished</SectionTitle>
                    <Box mb={10}>
                        {dataMyTeamMember?.myTeamMember.edges?.filter(({ node }) => scheduleFinishedMemberId!.includes(node.id)).
                            map(({ node }) => (
                                <Box key={node.id}>
                                    <ScheduleFinishedMemberItem nickname={node.nickname} isFinished={true} />
                                </Box>
                            ))
                        }
                    </Box>
                    <SectionTitle>Not Finished</SectionTitle>
                    <Box>
                        {dataMyTeamMember?.myTeamMember.edges?.filter(({ node }) => !scheduleFinishedMemberId!.includes(node.id)).
                            map(({ node }) => (
                                <Box key={node.id}>
                                    <ScheduleFinishedMemberItem nickname={node.nickname} isFinished={false} />
                                </Box>
                            ))
                        }
                    </Box>
                </>
            )}
        </SectionCard>
    )
})