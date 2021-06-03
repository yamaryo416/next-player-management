import { memo, useEffect, VFC } from "react";
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { useControllModal } from "../../../hooks/useControllModal";
import { oneMemberSelectedModalState } from "../../../store/oneMemberSelectedModalState";
import { ModalLayout } from "../layout/ModalLayout";
import { PrimaryButton } from "../../atoms/button/PrimaryButton";
import { DeleteButton } from "../../atoms/button/DeleteButton";
import { useGetMyTeamTrainings } from "../../../hooks/queries/useGetMyTeamTrainings";
import { TrainingIcon } from "../../molecules/TrainingIcon";
import { useTrainingContents } from "../../../hooks/useTrainingContents";
import { useGetOneMemberFinishedSchedules } from "../../../hooks/queries/useGetOneMemberFinishSchedules";
import { CustomSpinner } from "../../atoms/spinner/CustomSpinner";
import { FailedText } from "../../atoms/text/FailedText";

export const OneMemberDetailModal: VFC = memo(() => {
    const oneMemberSelectedModal = useRecoilValue(oneMemberSelectedModalState)

    const { loadingMyTeamTrainings, dataMyTeamTrainings, errorMyTeamTrainings } = useGetMyTeamTrainings()
    const {
        getOneMemberFinishedSchedules,
        loadingOneMemberFinishedSchedules,
        dataOneMemberFinishedSchedules,
        errorOneMemberFinishedSchedules,
    } = useGetOneMemberFinishedSchedules()
    const {
        onOpenConfirmTeamLeaveModal,
        onOpenConfirmHandOffCoachModal,
        onCloseOneMemberSelected
    } = useControllModal()
    const { showTrainingContents } = useTrainingContents()
    
    useEffect(() => {
        oneMemberSelectedModal.isOpen && getOneMemberFinishedSchedules(oneMemberSelectedModal.id)
    }, [oneMemberSelectedModal])

    return (
        <ModalLayout
            title=""
            isOpen={oneMemberSelectedModal.isOpen}
            onClose={onCloseOneMemberSelected}
        >
            <Box textAlign="center">
                <AccountCircleIcon  style={{ fontSize: 100 }}/>
            </Box>
            <Heading as="h4" textAlign="center" fontSize="16px" mb={10}>{oneMemberSelectedModal.nickname}</Heading>
            {!oneMemberSelectedModal.isCoach && (
                <Stack spacing={5} mb={10}>
                    <Box textAlign="center">
                        <PrimaryButton
                            type="button"
                            disabled={false}
                            onClick={() => 
                                onOpenConfirmHandOffCoachModal(oneMemberSelectedModal.id, oneMemberSelectedModal.nickname)
                            }
                        >
                            コーチ権限を委譲する
                        </PrimaryButton>
                    </Box>
                    <Box textAlign="center">
                        <DeleteButton
                            onClick={() => 
                                onOpenConfirmTeamLeaveModal(oneMemberSelectedModal.id, oneMemberSelectedModal.nickname, false)
                            }
                        >チームから脱退させる</DeleteButton>
                    </Box>
                </Stack>
            )}
            <Heading as="h4" textAlign="center" fontSize="16px">各トレーニングの実施状況</Heading>
            {loadingMyTeamTrainings || loadingOneMemberFinishedSchedules && <CustomSpinner />}
            {errorMyTeamTrainings || errorOneMemberFinishedSchedules ? (
                <FailedText />
            ):(
                <Box>
                    <Flex borderBottom="1px solid #718096">
                        <Box w="50px"></Box>
                        <Text w="200px">トレーニング</Text>
                        <Text>実施回数</Text>
                    </Flex>
                    <Stack spacing={2}>
                    {dataMyTeamTrainings?.myTeamTrainings.edges?.map((train) => (
                        <Flex key={train.node.id} borderBottom="1px solid #718096" alignItems="center">
                            <Box w="50px">
                                <TrainingIcon iconNumber={train.node.iconNumber} color="black" size="50px" />
                            </Box>
                            <Text w="180px">
                                {showTrainingContents(
                                    train.node.title,
                                    train.node.count,
                                    train.node.load,
                                    train.node.distance
                                )}
                            </Text>
                            <Text w="50px" pl="20px">
                                {dataOneMemberFinishedSchedules?.myTeamFinishedSchedules.edges?.
                                    filter((sche) => sche.node.schedule.training.id === train.node.id ).length}回
                            </Text>
                        </Flex>
                    ))}
                    </Stack>
                </Box>
            )}
         </ModalLayout> 
    )
})