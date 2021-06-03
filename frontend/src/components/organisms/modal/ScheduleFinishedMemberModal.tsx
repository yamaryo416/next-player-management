import { memo, useMemo, VFC } from "react";
import { useRecoilValue } from "recoil";
import { Box, Heading, Stack, Text } from "@chakra-ui/layout";

import { useGetMyTeamFinishedSchedules } from "../../../hooks/queries/useGetMyTeamFinishedSchedules";
import { useGetMyTeamMember } from "../../../hooks/queries/useGetMyTeamMember";
import { useControllModal } from "../../../hooks/useControllModal";
import { scheduleFinishedModalState } from "../../../store/scheduleFinishedModalState";
import { CustomSpinner } from "../../atoms/spinner/CustomSpinner";
import { FailedText } from "../../atoms/text/FailedText";
import { ScheduleFinishedMemberItem } from "../../molecules/ScheduleFinishedMemberItem";
import { ModalLayout } from "../layout/ModalLayout";

export const ScheduleFinishedMemberModal: VFC = memo(() => {
    const scheduleFinishedModal = useRecoilValue(scheduleFinishedModalState)

    const { loadingMyTeamFinishedSchedules, dataMyTeamFinishedSchedules, errorMyTeamFinishedSchedules } = useGetMyTeamFinishedSchedules()
    const { loadingMyTeamMember, dataMyTeamMember, errorMyTeamMember } = useGetMyTeamMember()

    const scheduleFinishedMemberId = useMemo(() => 
        dataMyTeamFinishedSchedules?.myTeamFinishedSchedules.edges?.
            filter((fSche) => fSche.node.schedule.id === scheduleFinishedModal.id ).
            map((fSche) => fSche.node.profile.id)
    , [dataMyTeamFinishedSchedules, scheduleFinishedModal])

    const { onCloseScheduleFinished } = useControllModal()
        
    return (
        <ModalLayout
            title="実施者リスト"
            isOpen={scheduleFinishedModal.isOpen === "modal"}
            onClose={onCloseScheduleFinished}
        >
            {loadingMyTeamFinishedSchedules || loadingMyTeamMember ? (
                <CustomSpinner />
            ): (
                <>
                    {(errorMyTeamFinishedSchedules || errorMyTeamMember) ? <FailedText /> : (
                        <Stack spacing={10}>
                            <Text fontSize="16px">
                                スケジュール: {scheduleFinishedModal.title}
                            </Text>
                            <Text fontSize="16px">
                                日付: {scheduleFinishedModal.date}
                            </Text>
                            <Heading as="h4" fontSize="20px" textAlign="center">実施済み</Heading>
                            <Box>
                                {dataMyTeamMember?.myTeamMember.edges?.filter(({ node }) => scheduleFinishedMemberId!.includes(node.id)).
                                    map(({ node }) => (
                                        <ScheduleFinishedMemberItem key={node.id} nickname={node.nickname} />
                                    ))
                                }
                            </Box>
                            <Heading as="h4" fontSize="20px" textAlign="center">未実施</Heading>
                            <Box>
                                {dataMyTeamMember?.myTeamMember.edges?.filter((member) => !scheduleFinishedMemberId!.includes(member.node.id)).
                                    map(({ node }) => (
                                        <ScheduleFinishedMemberItem key={node.id} nickname={node.nickname} />
                                    ))
                                }
                            </Box>
                        </Stack>
                    )}
                </>
            )}
        </ModalLayout>

    )
})