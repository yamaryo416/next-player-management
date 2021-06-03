import { mockGetMyTeamFinishedSchedulesHandler, mockGetOneMemberFinishedSchedulesHandler } from "./mockFinishedScheduleData";
import { mockGetMyTeamPostsHandler } from "./mockPostData";
import { mockGetMyProfileHandler, mockGetMyTeamMemberHandler, mockUpdateMyProfileNicknameMutation, mockUpdateProfileNicknameHandler } from "./mockProfileData";
import { mockGetMyTeamSchedulesHandler, mockGetOneDaySchedulesHandler } from "./mockScheduleData";
import { mockGetAllTeamBoardHandler } from "./mockTeamBoardData";
import { mockGetOneTeamFromIdHandler } from "./mockTeamData";
import { mockGetMyTeamTrainingsHandler } from "./mockTrainingData";

export const mainPageHandlers = [
    mockGetMyProfileHandler,
    mockGetMyTeamSchedulesHandler,
    mockGetOneDaySchedulesHandler,
    mockGetMyTeamTrainingsHandler,
    mockGetMyTeamPostsHandler,
    mockGetMyTeamMemberHandler,
    mockGetMyTeamFinishedSchedulesHandler,
    mockGetOneMemberFinishedSchedulesHandler,
    mockGetMyTeamMemberHandler
]

export const myTeamMemberPageHandler = [
    mockGetMyProfileHandler,
    mockGetMyTeamMemberHandler,
    mockGetOneMemberFinishedSchedulesHandler,
    mockGetMyTeamTrainingsHandler,
]

export const teamsPageHandlers = [
    mockGetMyProfileHandler,
    mockGetAllTeamBoardHandler
]

export const teamDetailPageHandler = [
    mockGetMyProfileHandler,
    mockGetOneTeamFromIdHandler
]