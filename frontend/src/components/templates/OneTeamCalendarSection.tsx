import { memo, VFC } from "react";

import { Maybe, ScheduleNodeType } from "../../../types/queriesType";
import { Calendar } from "../organisms/calendar/Calendar";
import { CalendarMenubar } from "../organisms/calendar/CalendarMenubar";
import { OneTeamCalendarDetail } from "../organisms/calendar/OneTeamCalendarDetail";
import { SectionCard } from "../organisms/layout/SectionCard";

type Props = {
    schedules: {
        edges: Maybe<ScheduleNodeType[]>
    } | undefined;
}

export const OneTeamCalendarSection: VFC<Props> = memo((props) => {
    const { schedules } = props;

    return (
        <SectionCard width="450px">
            <OneTeamCalendarDetail schedules={schedules} />
            <CalendarMenubar />
            <Calendar schedules={schedules}  />
        </SectionCard>
    )
})