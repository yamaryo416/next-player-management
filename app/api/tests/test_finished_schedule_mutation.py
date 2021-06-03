import json
import datetime

from graphene_django.utils.testing import GraphQLTestCase

from api.models import Profile, Schedule, FinishedScheduleMember
from api.utils.factory import UserFactory, TeamFactory, TrainingFactory, ScheduleFactory, FinishedScheduleMemberFactory
from api.utils.test_helper import create_token_headers
from api.utils.test_query import \
    GET_MY_TEAM_ONE_SCHEDULE_QUERY, CREATE_FINISHED_SCHEDULE_MEMBER_MUTATION, DELETE_FINISHED_SCHEDULE_MEMBER_MUTATION

class FinishedScheduleMemberMutationTestCase(GraphQLTestCase):
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
            profile__team_board=self.first_team.team_board,
            profile__finished_schedule_count=2
        )
        self.second_coach = UserFactory(
            profile__is_coach=True,
            profile__nickname="second coach user",
            profile__team_board=self.second_team.team_board
        )
        self.first_team_user = UserFactory(
            profile__is_coach=False,
            profile__nickname='first team user',
            profile__team_board=self.first_team.team_board
        )
        self.guest = UserFactory(
            profile__is_guest=True,
            profile__nickname='guest user',
            profile__team_board=self.first_team.team_board
        )
        self.first_training = TrainingFactory(
            title="first training",
            team_board=self.first_team.team_board
        )
        self.second_training = TrainingFactory(
            title="second training",
            team_board=self.first_team.team_board
        )
        self.yesterday_first_schedule = ScheduleFactory(
            training=self.first_training,
            date=datetime.date.today() - datetime.timedelta(days=1),
            team_board=self.first_team.team_board,
            finished_count=1
        )
        self.yesterday_second_schedule = ScheduleFactory(
            training=self.second_training,
            date=datetime.date.today() - datetime.timedelta(days=1),
            team_board=self.first_team.team_board,
            finished_count = 0
        )
        self.today_first_schedule = ScheduleFactory(
            training=self.first_training,
            date=datetime.date.today(),
            team_board=self.first_team.team_board,
            finished_count=1,
        )
        self.today_second_schedule = ScheduleFactory(
            training=self.second_training,
            date=datetime.date.today(),
            team_board=self.first_team.team_board,
            finished_count=0
        )
        self.today_finished_schedule_member = FinishedScheduleMemberFactory(
            schedule=self.today_first_schedule,
            training=self.first_training,
            profile=self.first_coach.profile
        )
        self.yesterday_finished_schedule_member = FinishedScheduleMemberFactory(
            schedule=self.yesterday_first_schedule,
            training=self.first_training,
            profile=self.first_coach.profile
        )

    def test_success_create_finished_schedule_member(self):
        one_day_schedule_response = self.query(
            GET_MY_TEAM_ONE_SCHEDULE_QUERY,
            op_name="myTeamSchedules",
            variables={'date': str(datetime.date.today()), 'training_Title': 'second training'},
            headers=create_token_headers(self.first_coach)
        )
        one_day_schedule_content = json.loads(one_day_schedule_response.content)
        schedule_id = one_day_schedule_content['data']['myTeamSchedules']['edges'][0]['node']['id']
        response = self.query(
            CREATE_FINISHED_SCHEDULE_MEMBER_MUTATION,
            op_name="createFinishedScheduleMember",
            variables={'scheduleId': schedule_id},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(FinishedScheduleMember.objects.all().count(), 3)
        self.assertTrue(FinishedScheduleMember.objects.filter(
            schedule=self.today_second_schedule,
            profile=self.first_coach.profile
        ).exists())
        self.assertEqual(Schedule.objects.get(pk=self.today_second_schedule.id).finished_count, 1)
        self.assertEqual(Profile.objects.get(user=self.first_coach).finished_schedule_count, 3)

    def test_failed_create_finished_schedule_member_because_schedule_is_already_finished(self):
        one_day_schedule_response = self.query(
            GET_MY_TEAM_ONE_SCHEDULE_QUERY,
            op_name="myTeamSchedules",
            variables={'date': str(datetime.date.today()), 'training_Title': 'first training'},
            headers=create_token_headers(self.first_coach)
        )
        one_day_schedule_content = json.loads(one_day_schedule_response.content)
        schedule_id = one_day_schedule_content['data']['myTeamSchedules']['edges'][0]['node']['id']
        response = self.query(
            CREATE_FINISHED_SCHEDULE_MEMBER_MUTATION,
            op_name="createFinishedScheduleMember",
            variables={'scheduleId': schedule_id},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Schedule is already finished')
        self.assertEqual(FinishedScheduleMember.objects.all().count(), 2)

    def test_failed_create_finished_schedule_member_because_yesterday_schedule(self):
        one_day_schedule_response = self.query(
            GET_MY_TEAM_ONE_SCHEDULE_QUERY,
            op_name="myTeamSchedules",
            variables={'date': str(datetime.date.today() - datetime.timedelta(days=1)), 'training_Title': 'second training'},
            headers=create_token_headers(self.first_coach)
        )
        one_day_schedule_content = json.loads(one_day_schedule_response.content)
        schedule_id = one_day_schedule_content['data']['myTeamSchedules']['edges'][0]['node']['id']
        response = self.query(
            CREATE_FINISHED_SCHEDULE_MEMBER_MUTATION,
            op_name="createFinishedScheduleMember",
            variables={'scheduleId': schedule_id},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Cannot finish any schedule other than today')
        self.assertEqual(FinishedScheduleMember.objects.all().count(), 2)

    def test_failed_create_finished_schedule_member_because_other_team_schedule(self):
        one_day_schedule_response = self.query(
            GET_MY_TEAM_ONE_SCHEDULE_QUERY,
            op_name="myTeamSchedules",
            variables={'date': str(datetime.date.today()), 'training_Title': 'second training'},
            headers=create_token_headers(self.first_coach)
        )
        one_day_schedule_content = json.loads(one_day_schedule_response.content)
        schedule_id = one_day_schedule_content['data']['myTeamSchedules']['edges'][0]['node']['id']
        response = self.query(
            CREATE_FINISHED_SCHEDULE_MEMBER_MUTATION,
            op_name="createFinishedScheduleMember",
            variables={'scheduleId': schedule_id},
            headers=create_token_headers(self.second_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Cannot finish other team schedule')
        self.assertEqual(FinishedScheduleMember.objects.all().count(), 2)

    def test_failed_create_finished_schedule_member_because_guest_user(self):
        one_day_schedule_response = self.query(
            GET_MY_TEAM_ONE_SCHEDULE_QUERY,
            op_name="myTeamSchedules",
            variables={'date': str(datetime.date.today()), 'training_Title': 'second training'},
            headers=create_token_headers(self.first_coach)
        )
        one_day_schedule_content = json.loads(one_day_schedule_response.content)
        schedule_id = one_day_schedule_content['data']['myTeamSchedules']['edges'][0]['node']['id']
        response = self.query(
            CREATE_FINISHED_SCHEDULE_MEMBER_MUTATION,
            op_name="createFinishedScheduleMember",
            variables={'scheduleId': schedule_id},
            headers=create_token_headers(self.guest)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'You do not have permission to perform this action')
        self.assertEqual(FinishedScheduleMember.objects.all().count(), 2)

    def test_failed_create_finished_schedule_member_because_not_login(self):
        one_day_schedule_response = self.query(
            GET_MY_TEAM_ONE_SCHEDULE_QUERY,
            op_name="myTeamSchedules",
            variables={'date': str(datetime.date.today()), 'training_Title': 'second training'},
            headers=create_token_headers(self.first_coach)
        )
        one_day_schedule_content = json.loads(one_day_schedule_response.content)
        schedule_id = one_day_schedule_content['data']['myTeamSchedules']['edges'][0]['node']['id']
        response = self.query(
            CREATE_FINISHED_SCHEDULE_MEMBER_MUTATION,
            op_name="createFinishedScheduleMember",
            variables={'scheduleId': schedule_id},
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'You do not have permission to perform this action')
        self.assertEqual(FinishedScheduleMember.objects.all().count(), 2)

    def test_success_delete_finished_schedule_member(self):
        one_day_schedule_response = self.query(
            GET_MY_TEAM_ONE_SCHEDULE_QUERY,
            op_name="myTeamSchedules",
            variables={'date': str(datetime.date.today()), 'training_Title': 'first training'},
            headers=create_token_headers(self.first_coach)
        )
        one_day_schedule_content = json.loads(one_day_schedule_response.content)
        schedule_id = one_day_schedule_content['data']['myTeamSchedules']['edges'][0]['node']['id']
        response = self.query(
            DELETE_FINISHED_SCHEDULE_MEMBER_MUTATION,
            op_name="deleteFinishedScheduleMember",
            variables={'scheduleId': schedule_id},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(FinishedScheduleMember.objects.all().count(), 1)
        self.assertFalse(FinishedScheduleMember.objects.filter(
            schedule=self.today_first_schedule,
            profile=self.first_coach.profile
        ).exists())
        self.assertEqual(Schedule.objects.get(pk=self.today_first_schedule.id).finished_count, 0)
        self.assertEqual(Profile.objects.get(user=self.first_coach).finished_schedule_count, 1)

    def test_failed_delete_finished_schedule_member_because_not_finished_schedule(self):
        one_day_schedule_response = self.query(
            GET_MY_TEAM_ONE_SCHEDULE_QUERY,
            op_name="myTeamSchedules",
            variables={'date': str(datetime.date.today()), 'training_Title': 'second training'},
            headers=create_token_headers(self.first_coach)
        )
        one_day_schedule_content = json.loads(one_day_schedule_response.content)
        schedule_id = one_day_schedule_content['data']['myTeamSchedules']['edges'][0]['node']['id']
        response = self.query(
            DELETE_FINISHED_SCHEDULE_MEMBER_MUTATION,
            op_name="deleteFinishedScheduleMember",
            variables={'scheduleId': schedule_id},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Schedule is not finished')
        self.assertEqual(FinishedScheduleMember.objects.all().count(), 2)

    def test_failed_delete_finished_schedule_member_because_yestarday_schedule(self):
        one_day_schedule_response = self.query(
            GET_MY_TEAM_ONE_SCHEDULE_QUERY,
            op_name="myTeamSchedules",
            variables={'date': str(datetime.date.today() - datetime.timedelta(days=1)), 'training_Title': 'first training'},
            headers=create_token_headers(self.first_coach)
        )
        one_day_schedule_content = json.loads(one_day_schedule_response.content)
        schedule_id = one_day_schedule_content['data']['myTeamSchedules']['edges'][0]['node']['id']
        response = self.query(
            DELETE_FINISHED_SCHEDULE_MEMBER_MUTATION,
            op_name="deleteFinishedScheduleMember",
            variables={'scheduleId': schedule_id},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Cannot delete finish schedule other than today')
        self.assertEqual(FinishedScheduleMember.objects.all().count(), 2)






