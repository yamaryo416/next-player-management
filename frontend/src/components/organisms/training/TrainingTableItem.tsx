import { memo, VFC } from "react";
import { Box, Flex, Text } from "@chakra-ui/layout";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { TrainingNodeType } from "../../../../types/queriesType";
import { TrainingIcon } from "../../molecules/TrainingIcon";
import { useGetMyProfile } from "../../../hooks/queries/useGetMyProfile";
import { useControllModal } from "../../../hooks/useControllModal";
import { useTrainingState } from "../../../hooks/useTrainingState";
import { useNumber } from "../../../hooks/useNumber";

type Props = TrainingNodeType & {
    isMyTeam: boolean;
}

export const TrainingTableItem: VFC<Props> = memo((props) => {
    const { node, isMyTeam } = props;

    const { dataMyProfile } = useGetMyProfile()
    const { onOpenTrainingUpdateModal} = useControllModal()
    const { zeroNumber } = useNumber()
    const { onOpneTrainingDetailModal, onOpenConfirmTrainingDeleteModal } = useControllModal()
     
    return (
        <Flex key={node.id} alignItems="center" borderBottom="1px solid #718096" py={5}>
            <Box w={{ base: "30px", md: "60px"}} data-testid={node.id + '-training-icon'}>
                <TrainingIcon iconNumber={node.iconNumber} color="white" size="50px" />
            </Box>
            <Text
                w={{ base: "70px", md: "130px" }}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"  
                data-testid={node.id + '-training-title'}              
                onClick={() => {
                    if (isMyTeam) {
                        onOpneTrainingDetailModal(
                            node.title,
                            zeroNumber(node.count),
                            zeroNumber(node.load),
                            zeroNumber(node.distance),
                            node.description,
                            zeroNumber(node.iconNumber)
                        )
                    } 
            }}>
                {node.title}
            </Text>
            <Text w={{ base: "30px", md: "40px"}} pl="5px" data-testid={node.id + '-training-count'} >
                {node.count !== 0 && node.count }
            </Text>
            <Text w={{ base: "30px", md: "40px"}} pl="5px" data-testid={node.id + '-training-load'} >
                {node.load !== 0 && node.load }
            </Text>
            <Text w={{ base: "30px", md: "40px"}} pl="5px" data-testid={node.id + '-training-distance'}>
                {node.distance !== 0 && node.distance}
            </Text>
            {isMyTeam && !dataMyProfile?.myProfile.isGuest! && (
                <>
                    <Text pl="15px" data-testid={node.id + '-training-finished-count'}>
                        {node.finishedSchedules.edges?.
                            filter(({ node }) => node.profile.id === dataMyProfile?.myProfile.id).length}回
                    </Text>
                    {dataMyProfile?.myProfile.isCoach && (
                        <>
                            <Box pl={{ base: 5, md: 10 }}>
                                <EditIcon
                                    data-testid={node.id + '-training-edit-icon'}
                                    onClick={() => {
                                        onOpenTrainingUpdateModal(
                                            node.id,
                                            node.title,
                                            zeroNumber(node.count),
                                            zeroNumber(node.load),
                                            zeroNumber(node.distance),
                                            node.description,
                                            zeroNumber(node.iconNumber)
                                        )
                                }} />
                            </Box>
                            <Box pl={5}>
                                <DeleteIcon
                                    data-testid={node.id + '-training-delete-icon'}
                                    onClick={() => {
                                        onOpenConfirmTrainingDeleteModal(
                                            node.id,
                                            node.title,
                                            zeroNumber(node.count),
                                            zeroNumber(node.load),
                                            zeroNumber(node.distance),
                                            node.description,
                                        )
                                    }}
                                / >
                            </Box>
                        </>
                    )}
                </>
            )}
        </Flex>
    )
})