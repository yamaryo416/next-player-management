import json

from graphene_django.utils.testing import GraphQLTestCase

from api.models import Team
from api.utils.factory import UserFactory, TeamFactory
from api.utils.test_helper import create_token_headers
from api.utils.test_query import GET_ONE_TEAM_FROM_ID_QUERY, GET_ONE_TEAM_FROM_NAME_QUERY

class TeamQueryTestCase(GraphQLTestCase):
    @classmethod
    def setUpTestData(self):
        for i in range(5):
            team = TeamFactory(name="team{0}".format(i), password="0000", team_board__coach="user{0}".format(i))
            user = UserFactory(profile__is_coach=True, profile__nickname="coach{0}".format(i), profile__team_board=team.team_board)
        self.user = UserFactory(profile__nickname="user")

    def test_success_get_one_team_from_name(self):
        response = self.query(
            GET_ONE_TEAM_FROM_NAME_QUERY,
            op_name="oneTeamFromName",
            variables={"name": "team0", "password": "0000"},
            headers=create_token_headers(self.user)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['oneTeamFromName']['name'], Team.objects.first().name)

    def test_failed_get_one_team_from_name_because_not_login(self):
        response = self.query(
            GET_ONE_TEAM_FROM_NAME_QUERY,
            op_name="oneTeamFromName",
            variables={"name": "team0", "password": "0000"}
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "You do not have permission to perform this action")

    def test_success_get_one_team_from_id(self):
        one_team_response = self.query(
            GET_ONE_TEAM_FROM_NAME_QUERY,
            op_name="oneTeamFromName",
            variables={"name": "team0", "password": "0000"},
            headers=create_token_headers(self.user)
        )
        one_team_content = json.loads(one_team_response.content)
        team_id = one_team_content['data']['oneTeamFromName']['id']
        response = self.query(
            GET_ONE_TEAM_FROM_ID_QUERY,
            op_name="oneTeamFromId",
            variables={"teamId": team_id},
            headers=create_token_headers(self.user)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['oneTeamFromId']['name'], Team.objects.first().name)

    def test_failed_get_one_team_from_id_because_not_login(self):
        one_team_response = self.query(
            GET_ONE_TEAM_FROM_NAME_QUERY,
            op_name="oneTeamFromName",
            variables={"name": "team0", "password": "0000"},
            headers=create_token_headers(self.user)
        )
        one_team_content = json.loads(one_team_response.content)
        team_id = one_team_content['data']['oneTeamFromName']['id']
        response = self.query(
            GET_ONE_TEAM_FROM_ID_QUERY,
            op_name="oneTeamFromId",
            variables={"teamId": team_id},
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "You do not have permission to perform this action")

