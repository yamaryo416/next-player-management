import json

from graphene_django.utils.testing import GraphQLTestCase

from api.models import Profile, TeamBoard
from api.utils.factory import UserFactory, TeamFactory
from api.utils.test_helper import create_token_headers
from api.utils.test_query import \
    GET_ONE_TEAM_MEMBER_QUERY, GET_ONE_TEAM_FROM_NAME_QUERY, UPDATE_PROFILE_NICKNAME_MUTATION, \
    UPDATE_PROFILE_TEAM_BOARD_MUTATION, DELETE_MY_PROFILE_TEAM_BOARD_MUTATION, DELETE_ONE_PROFILE_TEAM_BOARD_MUTATION


class ProfileMutationTestCase(GraphQLTestCase):
    @classmethod
    def setUpTestData(self):
        self.first_team = TeamFactory(
            name="first team",
            password="1111",
            team_board__coach="first coach user",
            team_board__join_count=3,
        )
        self.first_coach = UserFactory(
            profile__is_coach=True,
            profile__nickname="first coach user",
            profile__team_board=self.first_team.team_board
        )
        self.second_team = TeamFactory(
            name="second team",
            password="2222",
            team_board__join_count=2
        )
        self.second_coach = UserFactory(
            profile__is_coach=True,
            profile__nickname="second coach user",
            profile__team_board=self.second_team.team_board
        )
        self.first_team_first_user = UserFactory(profile__team_board=self.first_team.team_board,
                                                 profile__is_coach=False,
                                                 profile__nickname="first team user1")
        self.first_team_second_user = UserFactory(profile__team_board=self.first_team.team_board,
                                                  profile__is_coach=False,
                                                  profile__nickname="first team user2")
        self.second_team_user = UserFactory(profile__team_board=self.second_team.team_board, profile__is_coach=False, profile__nickname="second team user")
        self.guest_user = UserFactory(profile__team_board=self.first_team.team_board, profile__is_guest=True, profile__nickname="guest user")
        self.not_join_user = UserFactory(profile__is_coach=False, profile__nickname="not join user")
        self.not_join_guest_user = UserFactory(profile__is_guest=True, profile__nickname="not join guest user")

    def test_success_update_my_profile_nickname(self):
        response = self.query(
            UPDATE_PROFILE_NICKNAME_MUTATION,
            op_name="updateProfileNickname",
            variables={'nickname': 'first coach update'},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertFalse(Profile.objects.filter(nickname="first coach user").exists())
        self.assertTrue(Profile.objects.filter(nickname="first coach update").exists())

    def test_failed_update_my_profile_nickname_because_is_guest(self):
        response = self.query(
            UPDATE_PROFILE_NICKNAME_MUTATION,
            op_name="updateProfileNickname",
            variables={'nickname': 'guest update'},
            headers=create_token_headers(self.guest_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "You do not have permission to perform this action")
        self.assertFalse(Profile.objects.filter(nickname="guest update").exists())
        self.assertTrue(Profile.objects.filter(nickname="guest user").exists())

    def test_failed_update_my_profile_nickname_because_nickname_is_blank(self):
        response = self.query(
            UPDATE_PROFILE_NICKNAME_MUTATION,
            op_name="updateProfileNickname",
            variables={'nickname': ''},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Value is required")
        self.assertFalse(Profile.objects.filter(nickname="").exists())
        self.assertTrue(Profile.objects.filter(nickname="first coach user").exists())

    def test_failed_update_my_profile_nickname_because_nickname_is_too_long(self):
        response = self.query(
            UPDATE_PROFILE_NICKNAME_MUTATION,
            op_name="updateProfileNickname",
            variables={'nickname': 'a'*21},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "Value is too long")
        self.assertFalse(Profile.objects.filter(nickname="a"*21).exists())
        self.assertTrue(Profile.objects.filter(nickname="first coach user").exists())

    def test_success_update_my_profile_team_board_and_add_join_count(self):
        one_team_response = self.query(
            GET_ONE_TEAM_FROM_NAME_QUERY,
            op_name="oneTeamFromName",
            variables={'name': 'first team', 'password': "1111"},
            headers=create_token_headers(self.not_join_user)
        )
        one_team_content = json.loads(one_team_response.content)
        response = self.query(
            UPDATE_PROFILE_TEAM_BOARD_MUTATION,
            op_name="updateProfileTeamBoard",
            variables={'teamBoardId': one_team_content['data']['oneTeamFromName']['teamBoard']['id']},
            headers=create_token_headers(self.not_join_user)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Profile.objects.get(nickname="not join user").team_board.team.name, "first team" )
        self.assertEqual(TeamBoard.objects.get(team=self.first_team).join_count, 4)

    def test_success_update_guest_profile_team_board_and_no_change_join_count(self):
        one_team_response = self.query(
            GET_ONE_TEAM_FROM_NAME_QUERY,
            op_name="oneTeamFromName",
            variables={'name': 'first team', 'password': "1111"},
            headers=create_token_headers(self.not_join_guest_user)
        )
        one_team_content = json.loads(one_team_response.content)
        response = self.query(
            UPDATE_PROFILE_TEAM_BOARD_MUTATION,
            op_name="updateProfileTeamBoard",
            variables={'teamBoardId': one_team_content['data']['oneTeamFromName']['teamBoard']['id']},
            headers=create_token_headers(self.not_join_guest_user)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Profile.objects.get(nickname="not join guest user").team_board.team.name, "first team" )
        self.assertEqual(TeamBoard.objects.get(team=self.first_team).join_count, 3)

    def test_failed_update_my_profile_team_because_already_join(self):
        one_team_response = self.query(
            GET_ONE_TEAM_FROM_NAME_QUERY,
            op_name="oneTeamFromName",
            variables={'name': 'first team', 'password': "1111"},
            headers=create_token_headers(self.second_team_user)
        )
        one_team_content = json.loads(one_team_response.content)
        response = self.query(
            UPDATE_PROFILE_TEAM_BOARD_MUTATION,
            op_name="updateProfileTeamBoard",
            variables={'teamBoardId': one_team_content['data']['oneTeamFromName']['teamBoard']['id']},
            headers=create_token_headers(self.second_team_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "You do not have permission to perform this action")
        self.assertEqual(Profile.objects.get(pk=self.second_team_user.profile.id).team_board.team.name, "second team" )

    def test_success_delete_my_profile_team_board_and_decrease_join_count(self):
        response = self.query(
            DELETE_MY_PROFILE_TEAM_BOARD_MUTATION,
            op_name="deleteMyProfileTeamBoard",
            variables={'confirm': True},
            headers=create_token_headers(self.second_team_user)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Profile.objects.get(pk=self.second_team_user.profile.id).team_board, None)
        self.assertEqual(TeamBoard.objects.get(team=self.second_team).join_count, 1)

    def test_success_delete_guest_profile_team_board_and_no_change_join_count(self):
        response = self.query(
            DELETE_MY_PROFILE_TEAM_BOARD_MUTATION,
            op_name="deleteMyProfileTeamBoard",
            variables={'confirm': True},
            headers=create_token_headers(self.guest_user)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Profile.objects.get(pk=self.guest_user.profile.id).team_board, None)
        self.assertEqual(TeamBoard.objects.get(team=self.first_team).join_count, 3)

    def test_failed_delete_my_profile_team_board_because_is_coach(self):
        response = self.query(
            DELETE_MY_PROFILE_TEAM_BOARD_MUTATION,
            op_name="deleteMyProfileTeamBoard",
            variables={'confirm': True},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "You do not have permission to perform this action")
        self.assertEqual(Profile.objects.get(pk=self.first_coach.profile.id).team_board.team.name, "first team")

    def test_success_delete_one_profile_team_board_and_decrease_join_count(self):
        one_member_response = self.query(
            GET_ONE_TEAM_MEMBER_QUERY,
            op_name="myTeamMember",
            variables={"nickname": "first team user1"},
            headers=create_token_headers(self.first_coach)
        )
        one_member_content = json.loads(one_member_response.content)
        response = self.query(
            DELETE_ONE_PROFILE_TEAM_BOARD_MUTATION,
            op_name="deleteOneProfileTeamBoard",
            variables={'profileId': one_member_content["data"]["myTeamMember"]["edges"][0]["node"]["id"]},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Profile.objects.get(pk=self.first_team_first_user.profile.id).team_board, None)
        self.assertEqual(TeamBoard.objects.get(team=self.first_team).join_count, 2)

    def test_failed_delete_one_profile_team_because_not_coach(self):
        one_member_response = self.query(
            GET_ONE_TEAM_MEMBER_QUERY,
            op_name="myTeamMember",
            variables={"nickname": "first team user2"},
            headers=create_token_headers(self.first_coach)
        )
        one_member_content = json.loads(one_member_response.content)
        response = self.query(
            DELETE_ONE_PROFILE_TEAM_BOARD_MUTATION,
            op_name="deleteOneProfileTeamBoard",
            variables={'profileId': one_member_content["data"]["myTeamMember"]["edges"][0]["node"]["id"]},
            headers=create_token_headers(self.first_team_first_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]["message"], "You do not have permission to perform this action")
        self.assertEqual(Profile.objects.get(pk=self.first_team_second_user.profile.id).team_board.team.name, "first team")
        self.assertEqual(TeamBoard.objects.get(team=self.first_team).join_count, 3)
