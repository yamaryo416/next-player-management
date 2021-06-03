import json

from graphene_django.utils.testing import GraphQLTestCase

from api.models import Team, Profile
from api.utils.factory import UserFactory, TeamFactory
from api.utils.test_helper import create_token_headers
from api.utils.test_query import CREATE_TEAM_MUTATION, UPDATE_TEAM_MUTATION

class TeamMutationTestCase(GraphQLTestCase):
    @classmethod
    def setUpTestData(self):
        self.first_team = TeamFactory(
            name="first team",
            is_limit_join=False,
            password="0000",
            team_board__coach="first coach user",
            team_board__join_count=3
        )
        self.second_team = TeamFactory(
            name="second team",
            is_limit_join=False,
            password="0000",
            team_board__coach="second coach user",
            team_board__join_count=3
        )
        self.first_coach = UserFactory(
            profile__is_coach=True,
            profile__nickname="first coach user",
            profile__team_board=self.first_team.team_board
        )
        self.first_team_user = UserFactory(
            profile__nickname="first team user",
            profile__team_board=self.first_team.team_board
        )
        self.user = UserFactory(profile__nickname="user", profile__is_coach=False)
        self.guest_user = UserFactory(profile__nickname="guest user", profile__is_guest=True)

    def test_success_create_team_with_not_limit_join(self):
        response = self.query(
            CREATE_TEAM_MUTATION,
            op_name='createTeam',
            variables={'name': "team", 'isLimitJoin': False, 'password': '1111'},
            headers=create_token_headers(self.user)
        )
        json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Team.objects.all().count(), 3)
        self.assertEqual(Team.objects.get(name="team").password, '0000')
        self.assertEqual(Team.objects.get(name="team").team_board.coach, 'user')
        self.assertEqual(Profile.objects.get(pk=self.user.profile.id).is_coach, True)

    def test_success_create_team_with_limit_join(self):
        response = self.query(
            CREATE_TEAM_MUTATION,
            op_name='createTeam',
            variables={'name': "team", 'isLimitJoin': True, 'password': '1111'},
            headers=create_token_headers(self.user)
        )
        json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Team.objects.all().count(), 3)
        self.assertEqual(Team.objects.get(name="team").password, '1111')

    def test_failed_create_team_because_name_is_blank(self):
        response = self.query(
            CREATE_TEAM_MUTATION,
            op_name='createTeam',
            variables={'name': "", 'isLimitJoin': True, 'password': '1111'},
            headers=create_token_headers(self.user)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Value is required')
        self.assertEqual(Team.objects.all().count(), 2)
        self.assertFalse(Team.objects.filter(name="team").exists())

    def test_faile_create_team_because_name_is_too_long(self):
        response = self.query(
            CREATE_TEAM_MUTATION,
            op_name='createTeam',
            variables={'name': "a"*21, 'isLimitJoin': True, 'password': '1111'},
            headers=create_token_headers(self.user)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Value is too long')
        self.assertEqual(Team.objects.all().count(), 2)
        self.assertFalse(Team.objects.filter(name="team").exists())

    def test_faile_create_team_because_name_is_dupulicate(self):
        response = self.query(
            CREATE_TEAM_MUTATION,
            op_name='createTeam',
            variables={'name': "first team", 'isLimitJoin': True, 'password': '1111'},
            headers=create_token_headers(self.user)
        )
        content = json.loads(response.content)
        self.assertIn("duplicate", content["errors"][0]["message"])

    def test_faile_create_team_because_password_is_invalid(self):
        response = self.query(
            CREATE_TEAM_MUTATION,
            op_name='createTeam',
            variables={'name': "team", 'isLimitJoin': True, 'password': 'abcd'},
            headers=create_token_headers(self.user)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Password is Four Number')
        self.assertEqual(Team.objects.all().count(), 2)
        self.assertFalse(Team.objects.filter(name="team").exists())

    def test_faile_create_team_because_guest_user(self):
        response = self.query(
            CREATE_TEAM_MUTATION,
            op_name='createTeam',
            variables={'name': "team", 'isLimitJoin': True, 'password': '1111'},
            headers=create_token_headers(self.guest_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'You do not have permission to perform this action')
        self.assertEqual(Team.objects.all().count(), 2)
        self.assertFalse(Team.objects.filter(name="team").exists())

    def test_faile_create_team_because_aleady_join(self):
        response = self.query(
            CREATE_TEAM_MUTATION,
            op_name='createTeam',
            variables={'name': "team", 'isLimitJoin': True, 'password': '1111'},
            headers=create_token_headers(self.first_team_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'You do not have permission to perform this action')
        self.assertEqual(Team.objects.all().count(), 2)
        self.assertFalse(Team.objects.filter(name="team").exists())

    def test_faile_create_team_because_not_login(self):
        response = self.query(
            CREATE_TEAM_MUTATION,
            op_name='createTeam',
            variables={'name': "team", 'isLimitJoin': True, 'password': '1111'}
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'You do not have permission to perform this action')
        self.assertEqual(Team.objects.all().count(), 2)
        self.assertFalse(Team.objects.filter(name="team").exists())

    def test_success_update_team(self):
        response = self.query(
            UPDATE_TEAM_MUTATION,
            op_name='updateTeam',
            variables={'name': "first team update", 'isLimitJoin': True, 'password': '2222'},
            headers=create_token_headers(self.first_coach)
        )
        json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Team.objects.get(name="first team update").password, '2222')

    def test_failed_update_team_because_name_is_blank(self):
        response = self.query(
            UPDATE_TEAM_MUTATION,
            op_name='updateTeam',
            variables={'name': "", 'isLimitJoin': True, 'password': '1111'},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Value is required')
        self.assertFalse(Team.objects.filter(name="").exists())

    def test_faile_update_team_because_name_is_too_long(self):
        response = self.query(
            UPDATE_TEAM_MUTATION,
            op_name='updateTeam',
            variables={'name': "a"*21, 'isLimitJoin': True, 'password': '1111'},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Value is too long')
        self.assertFalse(Team.objects.filter(name="a"*21).exists())

    def test_faile_update_team_because_name_is_dupulicate(self):
        response = self.query(
            UPDATE_TEAM_MUTATION,
            op_name='updateTeam',
            variables={'name': "second team", 'isLimitJoin': True, 'password': '1111'},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertIn("duplicate", content["errors"][0]["message"])

    def test_faile_update_team_because_password_is_invalid(self):
        response = self.query(
            UPDATE_TEAM_MUTATION,
            op_name='updateTeam',
            variables={'name': "failed team", 'isLimitJoin': True, 'password': 'abcd'},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Password is Four Number')
        self.assertFalse(Team.objects.filter(name="failed team").exists())

    def test_failed_update_team_because_not_coach(self):
        response = self.query(
            UPDATE_TEAM_MUTATION,
            op_name='updateTeam',
            variables={'name': "first team update", 'isLimitJoin': True, 'password': '2222'},
            headers=create_token_headers(self.first_team_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'You do not have permission to perform this action')
        self.assertTrue(Team.objects.filter(name="first team").exists())
        self.assertFalse(Team.objects.filter(name="first team update").exists())

