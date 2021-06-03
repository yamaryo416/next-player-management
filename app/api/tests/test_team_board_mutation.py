import json

from graphene_django.utils.testing import GraphQLTestCase

from api.models import Profile, TeamBoard
from api.utils.factory import UserFactory, TeamFactory
from api.utils.test_helper import create_token_headers
from api.utils.test_query import \
    GET_ONE_TEAM_MEMBER_QUERY, GET_MY_PROFILE_QUERY, UPDATE_TEAM_BOARD_INTRODUCTION_MUTATION, \
    UPDATE_TEAM_BOARD_COACH_MUTATION


class TeamBoardMutationTestCase(GraphQLTestCase):
    @classmethod
    def setUpTestData(self):
        self.first_team = TeamFactory(
            name="first team",
            password="1111",
            team_board__coach="first coach",
            team_board__join_count=2,
            team_board__introduction="よろしく"
        )
        self.first_coach = UserFactory(
            profile__is_coach=True,
            profile__nickname="first coach",
            profile__team_board=self.first_team.team_board
        )
        self.first_team_first_user = UserFactory(
            profile__team_board=self.first_team.team_board,
            profile__is_coach=False,
            profile__nickname="first team user1"
        )
        self.first_team_second_user = UserFactory(
            profile__team_board=self.first_team.team_board,
            profile__is_coach=False,
            profile__nickname="first team user2"
        )
        self.not_join_user = UserFactory(
            profile__is_coach=False,
            profile__nickname="not join user"
        )

    def test_success_update_team_board_introduction(self):
        response = self.query(
            UPDATE_TEAM_BOARD_INTRODUCTION_MUTATION,
            op_name="updateTeamBoardIntroduction",
            variables={'introduction': 'よろしくお願いします。'},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(
            TeamBoard.objects.get(
                pk=self.first_team.team_board.id).introduction, "よろしくお願いします。"
        )

    def test_failed_update_team_board_introduction_because_value_is_too_long(self):
        response = self.query(
            UPDATE_TEAM_BOARD_INTRODUCTION_MUTATION,
            op_name="updateTeamBoardIntroduction",
            variables={'introduction': 'a'*101},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Value is too long')
        self.assertFalse(TeamBoard.objects.filter(introduction="a"*101).exists())
        self.assertTrue(TeamBoard.objects.filter(introduction='よろしく').exists())

    def test_failed_update_team_board_introduction_because_value_is_too_long(self):
        response = self.query(
            UPDATE_TEAM_BOARD_INTRODUCTION_MUTATION,
            op_name="updateTeamBoardIntroduction",
            variables={'introduction': 'a'*101},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Value is too long')
        self.assertFalse(TeamBoard.objects.filter(introduction="a"*101).exists())
        self.assertTrue(TeamBoard.objects.filter(introduction='よろしく').exists())

    def test_failed_update_team_board_introduction_because_not_coach(self):
        response = self.query(
            UPDATE_TEAM_BOARD_INTRODUCTION_MUTATION,
            op_name="updateTeamBoardIntroduction",
            variables={'introduction': 'よろしくお願いします。'},
            headers=create_token_headers(self.first_team_first_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'You do not have permission to perform this action')
        self.assertFalse(TeamBoard.objects.filter(introduction='よろしくお願いします。').exists())
        self.assertTrue(TeamBoard.objects.filter(introduction='よろしく').exists())

    def test_success_update_team_board_coach(self):
        my_team_member_response = self.query(
            GET_ONE_TEAM_MEMBER_QUERY,
            op_name='myTeamMember',
            variables={'nickname': 'first team user1'},
            headers=create_token_headers(self.first_coach)
        )
        my_team_member_content = json.loads(my_team_member_response.content)
        user_id = my_team_member_content['data']['myTeamMember']['edges'][0]['node']['id']
        response = self.query(
            UPDATE_TEAM_BOARD_COACH_MUTATION,
            op_name="updateTeamBoardCoach",
            variables={'profileId': user_id},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertFalse(Profile.objects.get(user=self.first_coach).is_coach)
        self.assertTrue(Profile.objects.get(user=self.first_team_first_user).is_coach)
        self.assertEqual(TeamBoard.objects.get(team=self.first_team).coach, 'first team user1')


    def test_failed_update_team_board_coach_because_selected_user_is_not_join(self):
        one_profile_response = self.query(
            GET_MY_PROFILE_QUERY,
            op_name='myProfile',
            headers=create_token_headers(self.not_join_user)
        )
        one_profile_content = json.loads(one_profile_response.content)
        user_id = one_profile_content['data']['myProfile']['id']
        response = self.query(
            UPDATE_TEAM_BOARD_COACH_MUTATION,
            op_name="updateTeamBoardCoach",
            variables={'profileId': user_id},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'Profile is not join my team')
        self.assertTrue(Profile.objects.get(user=self.first_coach).is_coach)
        self.assertFalse(Profile.objects.get(user=self.not_join_user).is_coach)
        self.assertEqual(TeamBoard.objects.get(team=self.first_team).coach, 'first coach')

    def test_failed_update_team_board_coach_because_not_coach(self):
        my_team_member_response = self.query(
            GET_ONE_TEAM_MEMBER_QUERY,
            op_name='myTeamMember',
            variables={'nickname': 'first team user2'},
            headers=create_token_headers(self.first_coach)
        )
        my_team_member_content = json.loads(my_team_member_response.content)
        user_id = my_team_member_content['data']['myTeamMember']['edges'][0]['node']['id']
        response = self.query(
            UPDATE_TEAM_BOARD_COACH_MUTATION,
            op_name="updateTeamBoardCoach",
            variables={'profileId': user_id},
            headers=create_token_headers(self.first_team_first_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content['errors'][0]['message'], 'You do not have permission to perform this action')
        self.assertTrue(Profile.objects.get(user=self.first_coach).is_coach)
        self.assertFalse(Profile.objects.get(user=self.first_team_second_user).is_coach)
        self.assertEqual(TeamBoard.objects.get(team=self.first_team).coach, 'first coach')
