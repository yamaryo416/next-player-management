import json

from graphene_django.utils.testing import GraphQLTestCase

from api.utils.factory import UserFactory, TeamFactory
from api.utils.test_helper import create_token_headers
from api.utils.test_query import GET_ALL_TEAM_BOARD_QUERY

class TeamBoardQueryTestCase(GraphQLTestCase):
    @classmethod
    def setUpTestData(self):
        for i in range(5):
            team = TeamFactory(name="team{0}".format(i), password="0000", team_board__coach="user{0}".format(i), team_board__join_count=i)
            UserFactory(profile__is_coach=True, profile__nickname="coach{0}".format(i),
                        profile__team_board=team.team_board)
        self.user = UserFactory(profile__is_coach=False, profile__nickname='user')

    def test_success_get_all_team_board(self):
        response = self.query(
            GET_ALL_TEAM_BOARD_QUERY,
            op_name='allTeamBoard',
            headers=create_token_headers(self.user)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(len(content["data"]["allTeamBoard"]["edges"]), 5)
        self.assertEqual(content["data"]["allTeamBoard"]["edges"][0]['node']['team']['name'], 'team4')
        self.assertEqual(content["data"]["allTeamBoard"]["edges"][0]['node']['joinCount'], 4)
        self.assertEqual(content["data"]["allTeamBoard"]["edges"][4]['node']['team']['name'], 'team0')
        self.assertEqual(content["data"]["allTeamBoard"]["edges"][4]['node']['joinCount'], 0)

    def test_failed_get_all_team_board_because_not_login(self):
        response = self.query(
            GET_ALL_TEAM_BOARD_QUERY,
            op_name="allTeamBoard"
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'You do not have permission to perform this action')

