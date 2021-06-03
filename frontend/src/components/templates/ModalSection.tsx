import { memo, VFC } from "react";

import { ConfirmHandOffCoachModal } from "../organisms/modal/ConfirmHandOffCoachModal";
import { ConfirmPostDeleteModal } from "../organisms/modal/ConfirmPostDeleteModal";
import { ConfirmScheduleDeleteModal } from "../organisms/modal/ConfirmScheduleDeleteModal";
import { ConfirmTeamLeaveModal } from "../organisms/modal/ConfirmTeamLeaveModal";
import { ConfirmTrainingDeleteModal } from "../organisms/modal/ConfirmTrainingDeleteModal";
import { ConfirmUserDeleteModal } from "../organisms/modal/ConfirmUserDeleteModal";
import { MyProfileEditModal } from "../organisms/modal/MyProfileEditModal";
import { OneMemberDetailModal } from "../organisms/modal/OneMemberDetailModal";
import { ScheduleCreateModal } from "../organisms/modal/ScheduleCreateModal";
import { ScheduleDeleteModal } from "../organisms/modal/ScheduleDeleteModal";
import { ScheduleFinishedMemberModal } from "../organisms/modal/ScheduleFinishedMemberModal";
import { TeamAuthModal } from "../organisms/modal/TeamAuthModal";
import { TeamEditModal } from "../organisms/modal/TeamEditModal";
import { TrainingCreateOrUpdateModal } from "../organisms/modal/TrainingCreateOrUpdateModal";
import { TrainingDetailModal } from "../organisms/modal/TrainingDetailModal";

type Props = {
    isJoinTeam: boolean;
    isCoach: boolean;
    page: "myPage" | "myTeamMemberPage" | "teamListPage" | "teamDetailPage"
}

export const ModalSection: VFC<Props> = memo((props) => {
    const {isJoinTeam, isCoach, page } = props;

    return (
        <>
            <MyProfileEditModal />
            <ConfirmUserDeleteModal />
            {isJoinTeam ? (
                <ConfirmTeamLeaveModal />
            ) : (
                <TeamAuthModal />
            )}
            {page === "myPage" && (
                <>
                    <ConfirmPostDeleteModal />
                    <TrainingDetailModal/>
                </>
            )}
            {page === "myTeamMemberPage" && isCoach && <OneMemberDetailModal /> }
            {page == "myTeamMemberPage" && isCoach && <ScheduleFinishedMemberModal />}
            {(page === "myPage" || page === "myTeamMemberPage") && isCoach && (
                <>
                    <TeamEditModal />
                    <TrainingCreateOrUpdateModal />
                    <ScheduleCreateModal />
                    <ScheduleDeleteModal />
                    <ConfirmHandOffCoachModal />
                    <ConfirmTrainingDeleteModal />
                    <ConfirmScheduleDeleteModal />
                    <ScheduleFinishedMemberModal />
                </>
            )}
        </>
    )
})