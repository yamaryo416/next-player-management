import json

from graphene_django.utils.testing import GraphQLTestCase

from api.models import CustomUser, Profile, TeamBoard
from api.utils.factory import UserFactory, TeamFactory
from api.utils.test_helper import create_token_headers
from api.utils.test_query import CREATE_GENERAL_USER_MUTATION, CREATE_GUEST_USER_MUTATION, DELETE_USER_MUTATION

class UserMutationTestCase(GraphQLTestCase):
    @classmethod
    def setUpTestData(self):
        self.team = TeamFactory(team_board__coach="coach user", team_board__join_count=3)
        self.coach_user = UserFactory(email="coach@example.com", profile__is_coach=True, profile__nickname="coach user", profile__team_board=self.team.team_board)
        self.general_user = UserFactory(profile__team_board=self.team.team_board, profile__is_coach=False, profile__nickname="general user")
        self.guest_user = UserFactory(profile__team_board=self.team.team_board, profile__is_guest=True, profile__nickname="guest user")

    def test_success_create_user(self):
        response = self.query(
            CREATE_GENERAL_USER_MUTATION,
            op_name='createGeneralUser',
            variables={ 'nickname': "success user", 'email': 'success@example.com', 'password': 'password' }
        )
        json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(CustomUser.objects.all().count(), 4)
        self.assertEqual(Profile.objects.all().count(), 4)
        self.assertTrue(CustomUser.objects.filter(email="success@example.com").exists())
        self.assertTrue(Profile.objects.filter(nickname="success user").exists())

    def test_failed_create_user_because_email_invalid(self):
        response = self.query(
            CREATE_GENERAL_USER_MUTATION,
            op_name='createGeneralUser',
            variables={ 'nickname': 'failed user', 'email': 'coach@example.com', 'password': 'password' }
        )
        content = json.loads(response.content)
        self.assertIn("duplicate", content["errors"][0]["message"])

    def test_failed_create_user_because_email_is_duplicate(self):
        response = self.query(
            CREATE_GENERAL_USER_MUTATION,
            op_name='createGeneralUser',
            variables={ 'nickname': 'failed user', 'email': 'failed.12345@failed', 'password': 'password' }
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Invalid Email Address")
        self.assertEqual(CustomUser.objects.all().count(), 3)
        self.assertEqual(Profile.objects.all().count(), 3)
        self.assertFalse(CustomUser.objects.filter(email="failed.12345@failed").exists())
        self.assertFalse(Profile.objects.filter(nickname="failed userr").exists())

    def test_failed_create_user_because_nikname_is_blank(self):
        response = self.query(
            CREATE_GENERAL_USER_MUTATION,
            op_name='createGeneralUser',
            variables={ 'nickname': '', 'email': "failed@failed.com", 'password': 'password'}
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Value is required")
        self.assertEqual(CustomUser.objects.all().count(), 3)
        self.assertEqual(Profile.objects.all().count(), 3)
        self.assertFalse(CustomUser.objects.filter(email="failed@failed.com").exists())
        self.assertFalse(Profile.objects.filter(nickname="").exists())

    def test_failed_create_user_because_nikname_is_too_long(self):
        response = self.query(
            CREATE_GENERAL_USER_MUTATION,
            op_name='createGeneralUser',
            variables={'nickname': "a"*21, 'email': "failed@failed.com", 'password': 'password'}
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Value is too long")
        self.assertEqual(CustomUser.objects.all().count(), 3)
        self.assertEqual(Profile.objects.all().count(), 3)
        self.assertFalse(CustomUser.objects.filter(email="failed@failed.com").exists())
        self.assertFalse(Profile.objects.filter(nickname="a"*21).exists())

    def test_failed_create_user_because_password_is_too_short(self):
        response = self.query(
            CREATE_GENERAL_USER_MUTATION,
            op_name='createGeneralUser',
            variables={'nickname': "failed", 'email': "failed@failed.com", 'password': 'a'*5}
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Password is too short")
        self.assertEqual(CustomUser.objects.all().count(), 3)
        self.assertEqual(Profile.objects.all().count(), 3)
        self.assertFalse(CustomUser.objects.filter(email="failed@failed.com").exists())
        self.assertFalse(Profile.objects.filter(nickname="failed").exists())

    def test_success_create_guest_user(self):
        response = self.query(
            CREATE_GUEST_USER_MUTATION,
            op_name="createGuestUser",
            variables={ 'password': "password" }
        )
        json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(CustomUser.objects.all().count(), 4)
        self.assertEqual(Profile.objects.all().count(), 4)
        self.assertTrue(Profile.objects.filter(nickname="ゲスト").exists())

    def test_failed_create_guest_user_because_password(self):
        response = self.query(
            CREATE_GUEST_USER_MUTATION,
            op_name="createGuestUser",
            variables={ 'password': "a"*5 }
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Password is too short")
        self.assertEqual(CustomUser.objects.all().count(),3)
        self.assertEqual(Profile.objects.all().count(), 3)
        self.assertFalse(Profile.objects.filter(nickname="ゲスト").exists())

    def test_success_delete_user_and_decrease_team_join_count(self):
        response = self.query(
            DELETE_USER_MUTATION,
            op_name="deleteUser",
            variables={ 'confirm': True },
            headers=create_token_headers(self.general_user)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(CustomUser.objects.all().count(), 2)
        self.assertEqual(Profile.objects.all().count(), 2)
        self.assertEqual(TeamBoard.objects.get(team=self.team).join_count, 2)

    def test_success_delete_guest_user_and_no_change_team_join_count(self):
        response = self.query(
            DELETE_USER_MUTATION,
            op_name="deleteUser",
            variables={ 'confirm': True },
            headers=create_token_headers(self.guest_user)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(CustomUser.objects.all().count(), 2)
        self.assertEqual(Profile.objects.all().count(), 2)
        self.assertEqual(TeamBoard.objects.get(team=self.team).join_count, 3)

    def test_failed_delete_user_because_is_coach(self):
        response = self.query(
            DELETE_USER_MUTATION,
            op_name="deleteUser",
            variables={'confirm': True},
            headers=create_token_headers(self.coach_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "You do not have permission to perform this action")
        self.assertEqual(CustomUser.objects.all().count(), 3)
        self.assertEqual(Profile.objects.all().count(), 3)
        self.assertEqual(TeamBoard.objects.get(team=self.team).join_count, 3)
