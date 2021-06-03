import { VFC, memo } from "react"
import { Box, Flex, Link, Text } from "@chakra-ui/layout"
import { useRecoilValue } from "recoil"
import moment from 'moment';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import InfoIcon from '@material-ui/icons/Info';
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import DeleteIcon from '@material-ui/icons/Delete';

import { scheduleOneDayState } from "../../../store/scheduleOneDayState"
import { useGetOneDaySchedules } from "../../../hooks/queries/useGetOneDaySchedules"
import { useGetMyProfile } from "../../../hooks/queries/useGetMyProfile";
import { useTrainingState } from "../../../hooks/useTrainingState";
import { useControllModal } from "../../../hooks/useControllModal";
import { useCreateFinishedSchedule } from "../../../hooks/queries/useCreateFinishedSchedule";
import { useDeleteFinishedSchedule } from "../../../hooks/queries/useDeleteFinishedSchedule";
import { CustomSpinner } from "../../atoms/spinner/CustomSpinner";
import { CalendarDetailMenubar } from "./CalendarDetailMenubar";
import { CalendarDetailContents } from "./CalendarDetailContents";
import { FailedText } from "../../atoms/text/FailedText";
import { TODAY } from "../../../../constants";
import { useNumber } from "../../../hooks/useNumber";

export const MyTeamCalendarDetail: VFC = memo(() => {
    const { dataMyProfile } = useGetMyProfile()
    const { loadingOnedaySchedules, dataOneDaySchedules, errorOneDaySchedules } = useGetOneDaySchedules()
    const { zeroNumber } = useNumber()
    const { onOpneTrainingDetailModal, onOpenConfirmScheduleDeleteModal, onOpenScheduleFinished } =useControllModal()
 
    const oneDay = useRecoilValue(scheduleOneDayState)
    const { createFinishedSchedule } = useCreateFinishedSchedule()
    const { deleteFinishedSchedule } = useDeleteFinishedSchedule()


    return (
       <Box textAlign="center">
           {loadingOnedaySchedules ? (
               <CustomSpinner />
           ): (
                <>
                    <CalendarDetailMenubar />
                    <Box py={7}>
                        {errorOneDaySchedules && <FailedText />}
                        {dataOneDaySchedules?.myTeamSchedules.edges?.map(({ node }) => (
                            <Box key={node.id} textAlign="left" mb={5}>
                                <Flex alignItems="center" >
                                    <CalendarDetailContents node={node} />
                                    <InfoIcon
                                        onClick={() => {
                                            onOpneTrainingDetailModal(
                                                node.training.title,
                                                zeroNumber(node.training.count),
                                                zeroNumber(node.training.load),
                                                zeroNumber(node.training.distance),
                                                node.training.description,
                                                zeroNumber(node.training.iconNumber)
                                            )
                                    }} />
                                    {moment(oneDay).isBefore(moment(TODAY)) && (
                                        <Box pl={3}>
                                             {node.finishedSchedules.edges?.some(({ node }) => node.profile.id === dataMyProfile?.myProfile.id ) ? (
                                                <Text color='orange' data-testid={node.id + '-finished-text'}>済</Text>
                                            ):(
                                                <Text color='gray.400' data-testid={node.id + '-not-finished-text'}>未</Text>
                                            )}
                                        </Box>
                                    )}
                                    {!dataMyProfile?.myProfile.isGuest && oneDay === TODAY && (
                                        <Box pl={3}>
                                            {node.finishedSchedules.edges?.some(({ node }) => node.profile.id === dataMyProfile?.myProfile.id ) ? (
                                                <CheckBoxIcon 
                                                    onClick={() => {
                                                        deleteFinishedSchedule(node.id, dataMyProfile?.myProfile.isCoach!)
                                                    }} 
                                                    data-testid={node.id + '-check-box-icon'}
                                                /> 
                                            ):(
                                                <CheckBoxOutlineBlankIcon 
                                                    onClick={() => {
                                                        createFinishedSchedule(node.id, dataMyProfile?.myProfile.isCoach!)
                                                    }} 
                                                    data-testid={node.id + '-check-box-outline-icon'}  
                                                />
                                            )}
                                        </Box>
                                    )}
                                    {dataMyProfile?.myProfile.isCoach && (
                                        <Box pl={7}>
                                            <DeleteIcon
                                                data-testid={node.id + '-schedule-delete-icon'}
                                                onClick={() => {
                                                    onOpenConfirmScheduleDeleteModal(
                                                        node.id,
                                                        node.training.title,
                                                        oneDay,
                                                        "",
                                                        "",
                                                        false
                                            )}}/>
                                        </Box> 
                                    )}
                                </Flex>
                                {dataMyProfile?.myProfile.isCoach && (
                                    <Flex pl={{ base: "40px", md: "60px" }} alignItems="center">
                                        <Text borderBottom="double 3px orange" data-testid={node.id + '-finished-count'}>
                                            {node.finishedCount}/{dataMyProfile?.myProfile.teamBoard.joinCount}人実施
                                        </Text>
                                        <Link
                                            display={{ base: "none", md: "inline"}}
                                            color="orange"
                                            pl={10}
                                            data-testid={node.id + '-finished-member-link'}
                                            onClick={() => 
                                                onOpenScheduleFinished(
                                                    node.id,
                                                    node.training.title,
                                                    node.date,
                                                    "section"
                                        )}>
                                            実施者一覧
                                        </Link>
                                        <Link 
                                            display={{ base: "inline", md: "none" }}
                                            color="orange"
                                            pl={10}
                                            onClick={() => 
                                                onOpenScheduleFinished(
                                                    node.id,
                                                    node.training.title,
                                                    node.date,
                                                    "modal"
                                        )}>
                                            実施者一覧
                                        </Link>
                                    </Flex>
                                )}
                            </Box>
                        ))}
                        {dataOneDaySchedules?.myTeamSchedules.edges?.length === 0 && (
                            <Text>予定はありません。</Text>
                        )}
                    </Box>
                </>
            )}
       </Box>
    )
})

