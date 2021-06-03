import json

from graphene_django.utils.testing import GraphQLTestCase

from api.utils.factory import UserFactory, TeamFactory, PostFactory
from api.utils.test_helper import create_token_headers
from api.utils.test_query import GET_MY_TEAM_POSTS_QUERY

class PostMutationtestCase(GraphQLTestCase):
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
        for i in range(5):
            PostFactory(text="first team post{0}".format(i), team_board=self.first_team.team_board, profile=self.first_coach.profile)
            PostFactory(text="second team post{0}".format(i), team_board=self.second_team.team_board, profile=self.second_coach.profile)

    def test_success_get_my_team_posts(self):
        response = self.query(
            GET_MY_TEAM_POSTS_QUERY,
            op_name='myTeamPosts',
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(len(content["data"]["myTeamPosts"]["edges"]), 5)
        self.assertEqual(content["data"]["myTeamPosts"]["edges"][0]['node']['text'], 'first team post4')
        self.assertEqual(content["data"]["myTeamPosts"]["edges"][4]['node']['text'], 'first team post0')

    def test_failed_get_my_team_posts_because_not_login(self):
        response = self.query(
            GET_MY_TEAM_POSTS_QUERY,
            op_name="myTeamPosts"
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'You do not have permission to perform this action')