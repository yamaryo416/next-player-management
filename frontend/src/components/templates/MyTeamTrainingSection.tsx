import { memo, useState, VFC } from "react"
import { Box, Center } from "@chakra-ui/layout"

import { SectionCard } from "../organisms/layout/SectionCard"
import { useGetMyTeamTrainings } from "../../hooks/queries/useGetMyTeamTrainings"
import { TrainingTableItem } from "../organisms/training/TrainingTableItem";
import { SectionTitle } from "../atoms/title/SectionTitle";
import { CustomSpinner } from "../atoms/spinner/CustomSpinner";
import { TrainingTableHeader } from "../organisms/training/TrainingTableHeader";
import { SectionCloseLink } from "../atoms/link/SectionCloseLink";
import { FetchMoreLink } from "../atoms/link/FetchMoreLink";
import { FailedText } from "../atoms/text/FailedText";

export const MyTeamTrainingSection:VFC = memo(() => {
    const [isDisplayAllTrainings, setIsDisplayAllTrainings] = useState(false)

    const { loadingMyTeamTrainings, dataMyTeamTrainings, errorMyTeamTrainings } = useGetMyTeamTrainings()
    
    return (
        <SectionCard width="500px">
            <SectionTitle>
                Training List
            </SectionTitle>
             {loadingMyTeamTrainings ? (
                 <CustomSpinner />
             ): (
                 <>
                    <TrainingTableHeader isMyTeam={true} />
                    { errorMyTeamTrainings && <FailedText />}
                    {dataMyTeamTrainings?.myTeamTrainings.edges?.length === 0 && <Center pt={10}>トレーニングを作成しましょう！</Center> }
                    {dataMyTeamTrainings?.myTeamTrainings.edges?.slice(0, 10).map(({ node }) => (
                        <TrainingTableItem node={node} isMyTeam={true} />
                    ))}
                    {isDisplayAllTrainings && dataMyTeamTrainings?.myTeamTrainings.edges?.slice(10).map(({ node }) => (
                        <TrainingTableItem node={node} isMyTeam={true} />
                    ))}
                    
                    {!isDisplayAllTrainings && dataMyTeamTrainings?.myTeamTrainings.edges?.slice(10).length !== 0 && (
                        <Box textAlign="center" mt={5}>
                            <FetchMoreLink
                                name='training'
                                text="全て表示"
                                onClick={() => setIsDisplayAllTrainings(true)}
                            />
                        </Box>
                    )}
                    {isDisplayAllTrainings && (
                        <Box mt={5}>
                            <SectionCloseLink
                                name='training-list'
                                onClick={() => setIsDisplayAllTrainings(false)}
                            />
                        </Box>
                    )}
                 </>
             )}
        </SectionCard>
    )
})