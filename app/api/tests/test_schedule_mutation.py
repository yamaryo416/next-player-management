import json
import datetime

from graphene_django.utils.testing import GraphQLTestCase

from api.models import Schedule
from api.utils.factory import UserFactory, TeamFactory, TrainingFactory, ScheduleFactory
from api.utils.test_helper import create_token_headers
from api.utils.test_query import \
    GET_ONE_TEAM_TRAINING_QUERY, GET_MY_TEAM_ONE_DAY_SCHEDULES_QUERY, CREATE_SCHEDULE_MUTATION, \
    CREATE_MANY_SCHEDULES_MUTATION, DELETE_SCHEDULE_MUTATION, DELETE_MANY_SCHEDULES_MUTATION

class ScheduleMutationTestCase(GraphQLTestCase):
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
        self.first_training = TrainingFactory(
            title="first training",
            team_board=self.first_team.team_board
        )
        self.second_training = TrainingFactory(
            title="second training",
            team_board=self.first_team.team_board
        )
        self.past_schedule = ScheduleFactory(
            training=self.first_training,
            team_board=self.first_team.team_board,
            date=datetime.date(2020, 1, 1)
        )
        self.schedule = ScheduleFactory(
            training=self.first_training,
            team_board=self.first_team.team_board,
            date=datetime.date(2022, 2, 1)
        )
        for i in range(10):
            ScheduleFactory(
                training=self.first_training,
                team_board=self.first_team.team_board,
                date=datetime.date(2022, 1, 1) + datetime.timedelta(days=i)
            )
        for i in range(5):
            ScheduleFactory(
                training=self.second_training,
                team_board=self.first_team.team_board,
                date=datetime.date(2022, 1, 1) + datetime.timedelta(days=i)
            )

    def test_success_create_schedule(self):
        my_team_training_response = self.query(
            GET_ONE_TEAM_TRAINING_QUERY,
            op_name='myTeamTrainings',
            variables={'title': "first training"},
            headers=create_token_headers(self.first_coach)
        )
        my_team_training_content = json.loads(my_team_training_response.content)
        training_id = my_team_training_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            CREATE_SCHEDULE_MUTATION,
            op_name="createSchedule",
            variables={'trainingId': training_id, 'date': '2022-01-01'},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Schedule.objects.all().count(), 18)

    def test_failed_create_schedule_because_past_date(self):
        my_team_training_response = self.query(
            GET_ONE_TEAM_TRAINING_QUERY,
            op_name='myTeamTrainings',
            variables={'title': "first training"},
            headers=create_token_headers(self.first_coach)
        )
        my_team_training_content = json.loads(my_team_training_response.content)
        training_id = my_team_training_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            CREATE_SCHEDULE_MUTATION,
            op_name="createSchedule",
            variables={'trainingId': training_id, 'date': '2020-01-01'},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], "Cannot register past date")
        self.assertEqual(Schedule.objects.all().count(), 17)

    def test_failed_create_schedule_because_selected_other_team_training(self):
        my_team_training_response = self.query(
            GET_ONE_TEAM_TRAINING_QUERY,
            op_name='myTeamTrainings',
            variables={'title': "first training"},
            headers=create_token_headers(self.first_coach)
        )
        my_team_training_content = json.loads(my_team_training_response.content)
        training_id = my_team_training_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            CREATE_SCHEDULE_MUTATION,
            op_name="createSchedule",
            variables={'trainingId': training_id, 'date': '2020-01-01'},
            headers=create_token_headers(self.second_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], "Cannot select other team training")
        self.assertEqual(Schedule.objects.all().count(), 17)

    def test_failed_create_schedule_because_not_coach(self):
        my_team_training_response = self.query(
            GET_ONE_TEAM_TRAINING_QUERY,
            op_name='myTeamTrainings',
            variables={'title': "first training"},
            headers=create_token_headers(self.first_team_user)
        )
        my_team_training_content = json.loads(my_team_training_response.content)
        training_id = my_team_training_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            CREATE_SCHEDULE_MUTATION,
            op_name="createSchedule",
            variables={'trainingId': training_id, 'date': '2020-01-01'},
            headers=create_token_headers(self.first_team_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], "You do not have permission to perform this action")
        self.assertEqual(Schedule.objects.all().count(), 17)

    def test_success_create_many_schedule(self):
        my_team_training_response = self.query(
            GET_ONE_TEAM_TRAINING_QUERY,
            op_name='myTeamTrainings',
            variables={'title': "first training"},
            headers=create_token_headers(self.first_coach)
        )
        my_team_training_content = json.loads(my_team_training_response.content)
        training_id = my_team_training_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            CREATE_MANY_SCHEDULES_MUTATION,
            op_name="createManySchedules",
            variables={'trainingId': training_id, 'startDate': '2022-01-01', 'endDate': '2022-01-30', 'dayOfWeek': '0123456' },
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Schedule.objects.all().count(), 47)

    def test_failed_create_many_schedule_because_past_date(self):
        my_team_training_response = self.query(
            GET_ONE_TEAM_TRAINING_QUERY,
            op_name='myTeamTrainings',
            variables={'title': "first training"},
            headers=create_token_headers(self.first_coach)
        )
        my_team_training_content = json.loads(my_team_training_response.content)
        training_id = my_team_training_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            CREATE_MANY_SCHEDULES_MUTATION,
            op_name="createManySchedules",
            variables={'trainingId': training_id, 'startDate': '2020-01-01', 'endDate': '2020-01-30',
                       'dayOfWeek': '0123456'},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], "Cannot register past date")
        self.assertEqual(Schedule.objects.all().count(), 17)

    def test_failed_create_many_schedule_because_period_is_not_correct(self):
        my_team_training_response = self.query(
            GET_ONE_TEAM_TRAINING_QUERY,
            op_name='myTeamTrainings',
            variables={'title': "first training"},
            headers=create_token_headers(self.first_coach)
        )
        my_team_training_content = json.loads(my_team_training_response.content)
        training_id = my_team_training_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            CREATE_MANY_SCHEDULES_MUTATION,
            op_name="createManySchedules",
            variables={'trainingId': training_id, 'startDate': '2022-01-31', 'endDate': '2020-01-01',
                       'dayOfWeek': '0123456'},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], "Please select the period correctly")
        self.assertEqual(Schedule.objects.all().count(), 17)

    def test_failed_create_many_schedule_because_selected_other_team_training(self):
        my_team_training_response = self.query(
            GET_ONE_TEAM_TRAINING_QUERY,
            op_name='myTeamTrainings',
            variables={'title': "first training"},
            headers=create_token_headers(self.first_coach)
        )
        my_team_training_content = json.loads(my_team_training_response.content)
        training_id = my_team_training_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            CREATE_MANY_SCHEDULES_MUTATION,
            op_name="createManySchedules",
            variables={'trainingId': training_id, 'startDate': '2022-01-01', 'endDate': '2020-01-31',
                       'dayOfWeek': '0123456'},
            headers=create_token_headers(self.second_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], "Cannot select other team training")
        self.assertEqual(Schedule.objects.all().count(), 17)

    def test_failed_create_many_schedule_because_not_coach(self):
        my_team_training_response = self.query(
            GET_ONE_TEAM_TRAINING_QUERY,
            op_name='myTeamTrainings',
            variables={'title': "first training"},
            headers=create_token_headers(self.first_team_user)
        )
        my_team_training_content = json.loads(my_team_training_response.content)
        training_id = my_team_training_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            CREATE_MANY_SCHEDULES_MUTATION,
            op_name="createManySchedules",
            variables={'trainingId': training_id, 'startDate': '2022-01-01', 'endDate': '2020-01-31',
                       'dayOfWeek': '0123456'},
            headers=create_token_headers(self.first_team_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], "You do not have permission to perform this action")
        self.assertEqual(Schedule.objects.all().count(), 17)

    def test_success_delete_schedule(self):
        my_team_schedules_response = self.query(
            GET_MY_TEAM_ONE_DAY_SCHEDULES_QUERY,
            op_name='myTeamSchedules',
            variables={'date': '2022-02-01'},
            headers=create_token_headers(self.first_coach)
        )
        my_team_schedules_content = json.loads(my_team_schedules_response.content)
        schedule_id = my_team_schedules_content['data']['myTeamSchedules']['edges'][0]['node']['id']
        response = self.query(
            DELETE_SCHEDULE_MUTATION,
            op_name="deleteSchedule",
            variables={'scheduleId': schedule_id},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Schedule.objects.all().count(), 16)
        self.assertFalse(Schedule.objects.filter(date="2022-02-01").exists())

    def test_failed_delete_schedule_because_past_schedule(self):
        my_team_schedules_response = self.query(
            GET_MY_TEAM_ONE_DAY_SCHEDULES_QUERY,
            op_name='myTeamSchedules',
            variables={'date': '2020-01-01'},
            headers=create_token_headers(self.first_coach)
        )
        my_team_schedules_content = json.loads(my_team_schedules_response.content)
        schedule_id = my_team_schedules_content['data']['myTeamSchedules']['edges'][0]['node']['id']
        response = self.query(
            DELETE_SCHEDULE_MUTATION,
            op_name="deleteSchedule",
            variables={'scheduleId': schedule_id},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], "Cannot delete past schedule")
        self.assertEqual(Schedule.objects.all().count(), 17)
        self.assertTrue(Schedule.objects.filter(date="2020-01-01").exists())

    def test_failed_delete_schedule_because_other_team_schedule(self):
        my_team_schedules_response = self.query(
            GET_MY_TEAM_ONE_DAY_SCHEDULES_QUERY,
            op_name='myTeamSchedules',
            variables={'date': '2022-02-01'},
            headers=create_token_headers(self.first_coach)
        )
        my_team_schedules_content = json.loads(my_team_schedules_response.content)
        schedule_id = my_team_schedules_content['data']['myTeamSchedules']['edges'][0]['node']['id']
        response = self.query(
            DELETE_SCHEDULE_MUTATION,
            op_name="deleteSchedule",
            variables={'scheduleId': schedule_id},
            headers=create_token_headers(self.second_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], "Cannot delete other team schedule")
        self.assertEqual(Schedule.objects.all().count(), 17)
        self.assertTrue(Schedule.objects.filter(date="2022-02-01").exists())

    def test_failed_delete_schedule_because_not_coach(self):
        my_team_schedules_response = self.query(
            GET_MY_TEAM_ONE_DAY_SCHEDULES_QUERY,
            op_name='myTeamSchedules',
            variables={'date': '2022-02-01'},
            headers=create_token_headers(self.first_team_user)
        )
        my_team_schedules_content = json.loads(my_team_schedules_response.content)
        schedule_id = my_team_schedules_content['data']['myTeamSchedules']['edges'][0]['node']['id']
        response = self.query(
            DELETE_SCHEDULE_MUTATION,
            op_name="deleteSchedule",
            variables={'scheduleId': schedule_id},
            headers=create_token_headers(self.first_team_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], "You do not have permission to perform this action")
        self.assertEqual(Schedule.objects.all().count(), 17)
        self.assertTrue(Schedule.objects.filter(date="2022-02-01").exists())

    def test_success_delete_my_many_schedules(self):
        response = self.query(
            DELETE_MANY_SCHEDULES_MUTATION,
            op_name="deleteManySchedules",
            variables={'startDate': '2022-01-01', 'endDate': '2022-01-10'},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertFalse(Schedule.objects.filter(date="2022-01-01").exists())
        self.assertEqual(Schedule.objects.all().count(), 2)

    def test_success_delete_my_many_schedules_with_training_selected(self):
        my_team_training_response = self.query(
            GET_ONE_TEAM_TRAINING_QUERY,
            op_name='myTeamTrainings',
            variables={'title': "first training"},
            headers=create_token_headers(self.first_coach)
        )
        my_team_training_content = json.loads(my_team_training_response.content)
        training_id = my_team_training_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            DELETE_MANY_SCHEDULES_MUTATION,
            op_name="deleteManySchedules",
            variables={'startDate': '2022-01-01', 'endDate': '2022-01-10', 'trainingId': training_id },
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertFalse(Schedule.objects.filter(date="2022-01-01", training=self.first_training).exists())
        self.assertTrue(Schedule.objects.filter(date="2022-01-01", training=self.second_training).exists())
        self.assertEqual(Schedule.objects.all().count(), 7)

    def test_failed_delete_my_many_schedules_because_period_is_not_correct(self):
        response = self.query(
            DELETE_MANY_SCHEDULES_MUTATION,
            op_name="deleteManySchedules",
            variables={'startDate': '2022-01-09', 'endDate': '2022-01-01'},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], "Please select the period correctly")
        self.assertTrue(Schedule.objects.filter(date="2022-01-01").exists())
        self.assertEqual(Schedule.objects.all().count(), 17)

    def test_failed_delete_my_many_schedules_because_past_schedule(self):
        response = self.query(
            DELETE_MANY_SCHEDULES_MUTATION,
            op_name="deleteManySchedules",
            variables={'startDate': '2020-01-01', 'endDate': '2022-01-09'},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], "Cannot delete past schedules")
        self.assertTrue(Schedule.objects.filter(date="2020-01-01").exists())
        self.assertEqual(Schedule.objects.all().count(), 17)

    def test_failed_delete_my_many_schedules_because_not_coach(self):
        response = self.query(
            DELETE_MANY_SCHEDULES_MUTATION,
            op_name="deleteManySchedules",
            variables={'startDate': '2022-01-01', 'endDate': '2022-01-09'},
            headers=create_token_headers(self.first_team_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], "You do not have permission to perform this action")
        self.assertTrue(Schedule.objects.filter(date="2022-01-01").exists())
        self.assertEqual(Schedule.objects.all().count(), 17)