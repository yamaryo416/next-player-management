import { memo, VFC } from "react"

import { Calendar } from "../organisms/calendar/Calendar"
import { CalendarMenubar } from "../organisms/calendar/CalendarMenubar"
import { MyTeamCalendarDetail } from "../organisms/calendar/MyTeamCalendarDetail"
import { SectionCard } from "../organisms/layout/SectionCard"
import { useGetMyTeamSchedules } from "../../hooks/queries/useGetMyTeamSchedules"
import { CustomSpinner } from "../atoms/spinner/CustomSpinner"
import { FailedText } from "../atoms/text/FailedText"

export const MyTeamCalendarSection: VFC= memo(() => {
    const { loadingMyTeamSchedules, dataMyTeamSchedules, errorMyTeamSchedules } = useGetMyTeamSchedules()
    
    return (
        <SectionCard width="450px">
            <MyTeamCalendarDetail />
            <CalendarMenubar />
            {loadingMyTeamSchedules ? (
                <CustomSpinner />
            ) : (
                <>
                    {errorMyTeamSchedules ? 
                        <FailedText /> :
                        <Calendar schedules={dataMyTeamSchedules?.myTeamSchedules} />
                    }
                </>
            )}
        </SectionCard>
    )
})
