import json
import datetime

from graphene_django.utils.testing import GraphQLTestCase

from api.utils.factory import UserFactory, TeamFactory, TrainingFactory, ScheduleFactory, FinishedScheduleMemberFactory
from api.utils.test_helper import create_token_headers
from api.utils.test_query import GET_MY_TEAM_FINISHED_SCHEDULES_QUERY

class ScheduleFinishedQueryTestCase(GraphQLTestCase):
    @classmethod
    def setUpTestData(self):
        self.first_team = TeamFactory(
            name="first team",
            password="0000",
            team_board__coach="first coach user",
            team_board__join_count=2,
        )
        self.second_team = TeamFactory(
            name="second team",
            password="0000",
            team_board__coach="second coach user",
            team_board__join_count=1,
        )
        self.first_coach = UserFactory(
            profile__is_coach=True,
            profile__nickname="first coach user",
            profile__team_board=self.first_team.team_board
        )
        self.first_team_user = UserFactory(
            profile__is_coach=False,
            profile__nickname="first team user",
            profile__team_board=self.first_team.team_board
        )
        self.second_coach = UserFactory(
            profile__is_coach=True,
            profile__nickname="second coach user",
            profile__team_board=self.second_team.team_board
        )
        self.first_team_training = TrainingFactory(
            title="first training",
            team_board=self.first_team.team_board
        )
        self.second_team_training = TrainingFactory(
            title="second training",
            team_board=self.second_team.team_board
        )
        for i in range(5):
            self.first_team_schedule = ScheduleFactory(
                training=self.first_team_training,
                team_board=self.first_team.team_board,
                date=datetime.date.today() + datetime.timedelta(days=i)
            )
            FinishedScheduleMemberFactory(
                schedule=self.first_team_schedule,
                training=self.first_team_training,
                profile=self.first_coach.profile
            )
            FinishedScheduleMemberFactory(
                schedule=self.first_team_schedule,
                training=self.first_team_training,
                profile=self.first_team_user.profile
            )
            self.second_team_schedule = ScheduleFactory(
                training=self.second_team_training,
                team_board=self.second_team.team_board,
                date=datetime.date.today() + datetime.timedelta(days=i)
            )
            FinishedScheduleMemberFactory(
                schedule=self.second_team_schedule,
                training=self.second_team_training,
                profile=self.second_coach.profile
            )

    def test_success_get_my_team_finished_schedules(self):
        response = self.query(
            GET_MY_TEAM_FINISHED_SCHEDULES_QUERY,
            op_name="myTeamFinishedSchedules",
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(len(content["data"]["myTeamFinishedSchedules"]["edges"]), 10)

    def test_failed_get_my_team_finished_schedules_because_not_coach(self):
        response = self.query(
            GET_MY_TEAM_FINISHED_SCHEDULES_QUERY,
            op_name="myTeamFinishedSchedules",
            headers=create_token_headers(self.first_team_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'You do not have permission to perform this action')

    def test_failed_get_my_team_finished_schedules_because_not_login(self):
        response = self.query(
            GET_MY_TEAM_FINISHED_SCHEDULES_QUERY,
            op_name="myTeamFinishedSchedules",
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'You do not have permission to perform this action')