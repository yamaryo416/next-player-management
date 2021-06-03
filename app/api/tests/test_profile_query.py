import json

from graphene_django.utils.testing import GraphQLTestCase

from api.utils.factory import UserFactory, TeamFactory
from api.utils.test_helper import create_token_headers
from api.utils.test_query import GET_MY_PROFILE_QUERY, GET_MY_TEAM_MEMBER_QUERY

class ProfileQueryTestCase(GraphQLTestCase):
    @classmethod
    def setUpTestData(self):
        self.team = TeamFactory(
            name="team",
            team_board__coach="first coach user",
            team_board__join_count=7,
        )
        self.coach = UserFactory(
            profile__is_coach=True,
            profile__nickname="coach user",
            profile__team_board=self.team.team_board
        )
        self.user = UserFactory(
            profile__is_coach=False,
            profile__nickname="first coach user",
            profile__team_board=self.team.team_board
        )
        for i in range(5):
            UserFactory(
                profile__is_coach=False,
                profile__nickname="user{0}".format(i),
                profile__team_board=self.team.team_board
            )
        for i in range(5):
            UserFactory(
                profile__is_guest=True,
                profile__nickname="guest{0}".format(i),
                profile__team_board=self.team.team_board
            )

    def test_success_get_my_profile(self):
        response = self.query(
            GET_MY_PROFILE_QUERY,
            op_name="myProfile",
            headers=create_token_headers(self.coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(content["data"]["myProfile"]['nickname'], 'coach user')

    def test_failed_get_my_profile_because_not_login(self):
        response = self.query(
            GET_MY_PROFILE_QUERY,
            op_name="myProfile",
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]['message'], 'You do not have permission to perform this action')

    def test_success_get_my_team_member(self):
        response = self.query(
            GET_MY_TEAM_MEMBER_QUERY,
            op_name="myTeamMember",
            headers=create_token_headers(self.coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(len(content["data"]["myTeamMember"]['edges']), 7)

    def test_success_get_my_team_member_because_not_coach(self):
        response = self.query(
            GET_MY_TEAM_MEMBER_QUERY,
            op_name="myTeamMember",
            headers=create_token_headers(self.user)
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]['message'], 'You do not have permission to perform this action')

    def test_success_get_my_team_member_because_not_login(self):
        response = self.query(
            GET_MY_TEAM_MEMBER_QUERY,
            op_name="myTeamMember",
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]['message'], 'You do not have permission to perform this action')
