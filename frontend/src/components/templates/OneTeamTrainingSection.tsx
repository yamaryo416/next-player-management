import { memo, VFC } from "react";
import { Center } from "@chakra-ui/layout";

import { Maybe, TrainingNodeType, TrainingType } from "../../../types/queriesType";
import { SectionTitle } from "../atoms/title/SectionTitle";
import { SectionCard } from "../organisms/layout/SectionCard";
import { TrainingTableHeader } from "../organisms/training/TrainingTableHeader";
import { TrainingTableItem } from "../organisms/training/TrainingTableItem";

type Props = {
    trainings: {
        edges : Maybe<TrainingNodeType[]>
    } | undefined;
};

export const OneTeamTrainingSection: VFC<Props> = memo((props) => {
    const { trainings } = props

    return (
        <SectionCard width="500px">
            <SectionTitle>Training List</SectionTitle>
            <TrainingTableHeader isMyTeam={false} />
            {trainings?.edges?.slice(0, 10).map(({ node }) => (
                <TrainingTableItem node={node} isMyTeam={false} />
            ))}
            {trainings?.edges?.length === 0 && <Center pt={10}>トレーニングはありません。</Center> }
        </SectionCard>
    )
})