import { memo, VFC } from "react";
import { Box, Flex, Text } from "@chakra-ui/layout";

import { useTrainingContents } from "../../../hooks/useTrainingContents";
import { ScheduleNodeType } from "../../../../types/queriesType";
import { TrainingIcon } from "../../molecules/TrainingIcon";

type Props = ScheduleNodeType;

export const CalendarDetailContents: VFC<Props> = memo((props) => {
    const { node } = props;

    const { showTrainingContents } = useTrainingContents()

    return (
        <Flex alignItems="center">
            <Box>
                <TrainingIcon iconNumber={node.training.iconNumber} color="white" size="50px" />
            </Box>
            <Text pl={1} pr={3} textAlign="left" data-testid={node.id + '-schedule-training'}>
                { showTrainingContents(
                    node.training.title,
                    node.training.count,
                    node.training.load,
                    node.training.distance
                )}
            </Text>
        </Flex>
    )
})