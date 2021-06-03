import json

from graphene_django.utils.testing import GraphQLTestCase

from api.models import Training
from api.utils.factory import UserFactory, TeamFactory, TrainingFactory
from api.utils.test_helper import create_token_headers
from api.utils.test_query import \
    GET_MY_TEAM_TRAININGS_QUERY, CREATE_TRAINING_MUTATION, UPDATE_TRAINING_MUTATION, DELETE_TRAINING_MUTATION

class TrainingMutationTestCase(GraphQLTestCase):
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
        self.training = TrainingFactory(
            title="training",
            team_board=self.first_team.team_board
        )


    def test_success_create_training(self):
        response = self.query(
            CREATE_TRAINING_MUTATION,
            op_name="createTraining",
            variables={
                'title': 'success training',
                'count': 0,
                'load': 0,
                'distance': 0,
                'description': "",
                'iconNumber': 0
            },
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Training.objects.count(), 2)
        self.assertTrue(Training.objects.filter(title='success training').exists())

    def test_failed_create_training_because_title_is_blank(self):
        response = self.query(
            CREATE_TRAINING_MUTATION,
            op_name="createTraining",
            variables={
                'title': '',
                'count': 0,
                'load': 0,
                'distance': 0,
                'description': "",
                'iconNumber': 0
            },
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Value is required')
        self.assertEqual(Training.objects.count(), 1)
        self.assertFalse(Training.objects.filter(title='').exists())

    def test_failed_create_training_because_title_is_too_long(self):
        response = self.query(
            CREATE_TRAINING_MUTATION,
            op_name="createTraining",
            variables={
                'title': 'a'*21,
                'count': 0,
                'load': 0,
                'distance': 0,
                'description': "",
                'iconNumber': 0
            },
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Value is too long')
        self.assertEqual(Training.objects.count(), 1)
        self.assertFalse(Training.objects.filter(title='a'*21).exists())

    def test_failed_create_training_because_not_coach(self):
        response = self.query(
            CREATE_TRAINING_MUTATION,
            op_name="createTraining",
            variables={
                'title': 'failed training',
                'count': 0,
                'load': 0,
                'distance': 0,
                'description': "",
                'iconNumber': 0
            },
            headers=create_token_headers(self.first_team_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'You do not have permission to perform this action')
        self.assertEqual(Training.objects.count(), 1)
        self.assertFalse(Training.objects.filter(title='failed training').exists())

    def test_success_update_training(self):
        my_team_trainings_response = self.query(
            GET_MY_TEAM_TRAININGS_QUERY,
            op_name='myTeamTrainings',
            headers=create_token_headers(self.first_coach)
        )
        my_team_trainings_content = json.loads(my_team_trainings_response.content)
        training_id = my_team_trainings_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            UPDATE_TRAINING_MUTATION,
            op_name="updateTraining",
            variables={
                'trainingId': training_id,
                'title': 'training update',
                'count': 10,
                'load': 0,
                'distance': 0,
                'description': "",
                'iconNumber': 0
            },
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Training.objects.get(title='training update').count, 10)
        self.assertFalse(Training.objects.filter(title='training').exists())

    def test_failed_update_training_because_title_is_blank(self):
        my_team_trainings_response = self.query(
            GET_MY_TEAM_TRAININGS_QUERY,
            op_name='myTeamTrainings',
            headers=create_token_headers(self.first_coach)
        )
        my_team_trainings_content = json.loads(my_team_trainings_response.content)
        training_id = my_team_trainings_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            UPDATE_TRAINING_MUTATION,
            op_name="updateTraining",
            variables={
                'trainingId': training_id,
                'title': '',
                'count': 0,
                'load': 0,
                'distance': 0,
                'description': "",
                'iconNumber': 0
            },
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Value is required')
        self.assertFalse(Training.objects.filter(title='').exists())
        self.assertTrue(Training.objects.filter(title='training').exists())

    def test_failed_update_training_because_title_is_too_long(self):
        my_team_trainings_response = self.query(
            GET_MY_TEAM_TRAININGS_QUERY,
            op_name='myTeamTrainings',
            headers=create_token_headers(self.first_coach)
        )
        my_team_trainings_content = json.loads(my_team_trainings_response.content)
        training_id = my_team_trainings_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            UPDATE_TRAINING_MUTATION,
            op_name="updateTraining",
            variables={
                'trainingId': training_id,
                'title': 'a'*21,
                'count': 0,
                'load': 0,
                'distance': 0,
                'description': "",
                'iconNumber': 0
            },
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Value is too long')
        self.assertFalse(Training.objects.filter(title='a'*21).exists())
        self.assertTrue(Training.objects.filter(title='training').exists())

    def test_failed_update_training_because_other_team_training(self):
        my_team_trainings_response = self.query(
            GET_MY_TEAM_TRAININGS_QUERY,
            op_name='myTeamTrainings',
            headers=create_token_headers(self.first_coach)
        )
        my_team_trainings_content = json.loads(my_team_trainings_response.content)
        training_id = my_team_trainings_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            UPDATE_TRAINING_MUTATION,
            op_name="updateTraining",
            variables={
                'trainingId': training_id,
                'title': 'update training',
                'count': 0,
                'load': 0,
                'distance': 0,
                'description': "",
                'iconNumber': 0
            },
            headers=create_token_headers(self.second_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Other team training cannot be changed')
        self.assertFalse(Training.objects.filter(title='update training').exists())
        self.assertTrue(Training.objects.filter(title='training').exists())

    def test_failed_update_training_because_not_coach(self):
        my_team_trainings_response = self.query(
            GET_MY_TEAM_TRAININGS_QUERY,
            op_name='myTeamTrainings',
            headers=create_token_headers(self.first_team_user)
        )
        my_team_trainings_content = json.loads(my_team_trainings_response.content)
        training_id = my_team_trainings_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            UPDATE_TRAINING_MUTATION,
            op_name="updateTraining",
            variables={
                'trainingId': training_id,
                'title': 'a' * 21,
                'count': 0,
                'load': 0,
                'distance': 0,
                'description': "",
                'iconNumber': 0
            },
            headers=create_token_headers(self.first_team_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'You do not have permission to perform this action')
        self.assertFalse(Training.objects.filter(title='a' * 21).exists())
        self.assertTrue(Training.objects.filter(title='training').exists())

    def test_success_delete_training(self):
        my_team_trainings_response = self.query(
            GET_MY_TEAM_TRAININGS_QUERY,
            op_name='myTeamTrainings',
            headers=create_token_headers(self.first_coach)
        )
        my_team_trainings_content = json.loads(my_team_trainings_response.content)
        training_id = my_team_trainings_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            DELETE_TRAINING_MUTATION,
            op_name="deleteTraining",
            variables={'trainingId': training_id},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Training.objects.all().count(), 0)

    def test_failed_delete_training_because_other_team_training(self):
        my_team_trainings_response = self.query(
            GET_MY_TEAM_TRAININGS_QUERY,
            op_name='myTeamTrainings',
            headers=create_token_headers(self.first_coach)
        )
        my_team_trainings_content = json.loads(my_team_trainings_response.content)
        training_id = my_team_trainings_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            DELETE_TRAINING_MUTATION,
            op_name="deleteTraining",
            variables={'trainingId': training_id},
            headers=create_token_headers(self.second_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Other team training cannot be deleted')
        self.assertEqual(Training.objects.all().count(), 1)

    def test_failed_delete_training_because_other_team_training(self):
        my_team_trainings_response = self.query(
            GET_MY_TEAM_TRAININGS_QUERY,
            op_name='myTeamTrainings',
            headers=create_token_headers(self.first_team_user)
        )
        my_team_trainings_content = json.loads(my_team_trainings_response.content)
        training_id = my_team_trainings_content['data']['myTeamTrainings']['edges'][0]['node']['id']
        response = self.query(
            DELETE_TRAINING_MUTATION,
            op_name="deleteTraining",
            variables={'trainingId': training_id},
            headers=create_token_headers(self.first_team_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'You do not have permission to perform this action')
        self.assertEqual(Training.objects.all().count(), 1)


