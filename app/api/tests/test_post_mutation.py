import json

from graphene_django.utils.testing import GraphQLTestCase

from api.models import Post
from api.utils.factory import UserFactory, TeamFactory, PostFactory
from api.utils.test_helper import create_token_headers
from api.utils.test_query import GET_MY_TEAM_ONE_POST_QUERY, CREATE_POST_MUTATION, DELETE_POST_MUTATION

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
        self.first_team_user = UserFactory(
            profile__is_coach=False,
            profile__nickname='first team user',
            profile__team_board=self.first_team.team_board
        )
        self.guest = UserFactory(
            profile__is_guest=True,
            profile__nickname='guest',
            profile__team_board=self.first_team.team_board
        )
        self.coach_post = PostFactory(
            text='コーチです',
            team_board=self.first_team.team_board,
            profile=self.first_coach.profile
        )
        self.first_team_user_post = PostFactory(
            text='ユーザーです',
            team_board=self.first_team.team_board,
            profile=self.first_team_user.profile
        )

    def test_success_create_post(self):
        response = self.query(
            CREATE_POST_MUTATION,
            op_name="createPost",
            variables={'text': 'よろしくお願いします。'},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Post.objects.all().count(), 3)
        self.assertTrue(Post.objects.filter(text='よろしくお願いします。', team_board=self.first_team.team_board, profile=self.first_coach.profile))

    def test_failed_create_post_because_text_is_blank(self):
        response = self.query(
            CREATE_POST_MUTATION,
            op_name="createPost",
            variables={'text': ''},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]['message'], 'Value is required')
        self.assertEqual(Post.objects.all().count(), 2)
        self.assertFalse(Post.objects.filter(text='', team_board=self.first_team.team_board, profile=self.first_coach.profile))

    def test_failed_create_post_because_text_is_too_long(self):
        response = self.query(
            CREATE_POST_MUTATION,
            op_name="createPost",
            variables={'text': 'a'*101},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]['message'], 'Value is too long')
        self.assertEqual(Post.objects.all().count(), 2)
        self.assertFalse(Post.objects.filter(text='a'*101, team_board=self.first_team.team_board, profile=self.first_coach.profile))

    def test_failed_create_post_because_guest(self):
        response = self.query(
            CREATE_POST_MUTATION,
            op_name="createPost",
            variables={'text': 'ゲストです'},
            headers=create_token_headers(self.guest)
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]['message'], 'You do not have permission to perform this action')
        self.assertEqual(Post.objects.all().count(), 2)
        self.assertFalse(Post.objects.filter(text='ゲストです', team_board=self.first_team.team_board, profile=self.guest.profile))

    def test_success_delete_my_post_as_a_coach(self):
        my_team_post_response = self.query(
            GET_MY_TEAM_ONE_POST_QUERY,
            op_name="myTeamPosts",
            variables={'text': 'コーチです'},
            headers=create_token_headers(self.first_coach)
        )
        my_team_post_content = json.loads(my_team_post_response.content)
        post_id = my_team_post_content['data']['myTeamPosts']['edges'][0]['node']['id']
        response = self.query(
            DELETE_POST_MUTATION,
            op_name="deletePost",
            variables={'postId': post_id},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Post.objects.all().count(), 1)
        self.assertFalse(Post.objects.filter(text='コーチです', team_board=self.first_team.team_board, profile=self.first_coach.profile))

    def test_success_delete_my_post_as_a_not_coach(self):
        my_team_post_response = self.query(
            GET_MY_TEAM_ONE_POST_QUERY,
            op_name="myTeamPosts",
            variables={'text': 'ユーザーです'},
            headers=create_token_headers(self.first_team_user)
        )
        my_team_post_content = json.loads(my_team_post_response.content)
        post_id = my_team_post_content['data']['myTeamPosts']['edges'][0]['node']['id']
        response = self.query(
            DELETE_POST_MUTATION,
            op_name="deletePost",
            variables={'postId': post_id},
            headers=create_token_headers(self.first_team_user)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Post.objects.all().count(), 1)
        self.assertFalse(Post.objects.filter(text='ユーザーです', team_board=self.first_team.team_board, profile=self.first_team_user.profile))

    def test_success_delete_member_post_as_a_coach(self):
        my_team_post_response = self.query(
            GET_MY_TEAM_ONE_POST_QUERY,
            op_name="myTeamPosts",
            variables={'text': 'ユーザーです'},
            headers=create_token_headers(self.first_coach)
        )
        my_team_post_content = json.loads(my_team_post_response.content)
        post_id = my_team_post_content['data']['myTeamPosts']['edges'][0]['node']['id']
        response = self.query(
            DELETE_POST_MUTATION,
            op_name="deletePost",
            variables={'postId': post_id},
            headers=create_token_headers(self.first_coach)
        )
        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        self.assertEqual(Post.objects.all().count(), 1)
        self.assertFalse(Post.objects.filter(text='ユーザーです', team_board=self.first_team.team_board, profile=self.first_team_user.profile))

    def test_failed_delete_member_post_because_not_coach(self):
        my_team_post_response = self.query(
            GET_MY_TEAM_ONE_POST_QUERY,
            op_name="myTeamPosts",
            variables={'text': 'コーチです'},
            headers=create_token_headers(self.first_team_user)
        )
        my_team_post_content = json.loads(my_team_post_response.content)
        post_id = my_team_post_content['data']['myTeamPosts']['edges'][0]['node']['id']
        response = self.query(
            DELETE_POST_MUTATION,
            op_name="deletePost",
            variables={'postId': post_id},
            headers=create_token_headers(self.first_team_user)
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]['message'], 'You do not have permission to perform this action')
        self.assertEqual(Post.objects.all().count(), 2)
        self.assertTrue(Post.objects.filter(text='コーチです', team_board=self.first_team.team_board,
                                            profile=self.first_coach.profile))

    def test_failed_delete_member_post_because_other_team_post(self):
        my_team_post_response = self.query(
            GET_MY_TEAM_ONE_POST_QUERY,
            op_name="myTeamPosts",
            variables={'text': 'コーチです'},
            headers=create_token_headers(self.first_team_user)
        )
        my_team_post_content = json.loads(my_team_post_response.content)
        post_id = my_team_post_content['data']['myTeamPosts']['edges'][0]['node']['id']
        response = self.query(
            DELETE_POST_MUTATION,
            op_name="deletePost",
            variables={'postId': post_id},
            headers=create_token_headers(self.second_coach)
        )
        content = json.loads(response.content)
        self.assertEqual(content["errors"][0]['message'], 'Cannot delete other team post')
        self.assertEqual(Post.objects.all().count(), 2)
        self.assertTrue(Post.objects.filter(text='コーチです', team_board=self.first_team.team_board,
                                            profile=self.first_coach.profile))