import graphene
import graphql_jwt

from graphene_django.filter import DjangoFilterConnectionField
from graphql_jwt.decorators import login_required, user_passes_test
from graphql_relay import from_global_id

from api.models import Profile, Team, TeamBoard, Training, Schedule, FinishedScheduleMember, Post
from api.graphql.mutation.user_mutation import CreateGeneralUserMutation, CreateGuestUserMutation, DeleteUserMutation
from api.graphql.mutation.profile_mutation import \
    UpdateProfileNicknameMutation, UpdateProfileTeamBoardMutation, DeleteMyProfileTeamBoardMutation, \
    DeleteOneProfileTeamBoardMutation
from api.graphql.mutation.team_mutation import CreateTeamMutation, UpdateTeamMutation
from api.graphql.mutation.team_board_mutation import UpdateTeamBoardIntroductionMutation, UpdateTeamBoardCoachMutation
from api.graphql.mutation.training_mutation import \
    CreateTrainingMutation, UpdateTrainingMutation, DeleteTrainingMutation
from api.graphql.mutation.schedule_mutation import \
    CreateScheduleMutation, CreateManySchedulesMutation, DeleteScheduleMutation, DeleteManySchedulesMutation
from api.graphql.mutation.finished_schedule_member_mutation import \
    CreateFinishedScheduleMemberMutation, DeleteFinishedScheduleMemberMutation
from api.graphql.mutation.post_mutation import CreatePostMutation, DeletePostMutation
from api.graphql.node import \
    ProfileNode, TeamNode, TeamBoardNode, TrainingNode, ScheduleNode, FinishedScheduleMemberNode, PostNode


class Mutation(graphene.AbstractType):
    create_general_user = CreateGeneralUserMutation.Field()
    create_guest_user = CreateGuestUserMutation.Field()
    delete_user = DeleteUserMutation.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    update_profile_nickname = UpdateProfileNicknameMutation.Field()
    update_profile_team_board = UpdateProfileTeamBoardMutation.Field()
    delete_my_profile_team_board = DeleteMyProfileTeamBoardMutation.Field()
    delete_one_profile_team_board = DeleteOneProfileTeamBoardMutation.Field()
    create_team = CreateTeamMutation.Field()
    update_team = UpdateTeamMutation.Field()
    update_team_board_introduction = UpdateTeamBoardIntroductionMutation.Field()
    update_team_board_coach = UpdateTeamBoardCoachMutation.Field()
    create_training = CreateTrainingMutation.Field()
    update_training = UpdateTrainingMutation.Field()
    delete_training = DeleteTrainingMutation.Field()
    create_schedule = CreateScheduleMutation.Field()
    create_many_schedules = CreateManySchedulesMutation.Field()
    delete_schedule = DeleteScheduleMutation.Field()
    delete_many_schedules = DeleteManySchedulesMutation.Field()
    create_finished_schedule_member = CreateFinishedScheduleMemberMutation.Field()
    delete_finished_schedule_member = DeleteFinishedScheduleMemberMutation.Field()
    create_post = CreatePostMutation.Field()
    delete_post = DeletePostMutation.Field()


class Query(graphene.ObjectType):
    my_profile = graphene.Field(ProfileNode)
    one_team_from_name = graphene.Field(TeamNode,
                                        name=graphene.NonNull(graphene.String),
                                        password=graphene.NonNull(graphene.String))
    one_team_from_id = graphene.Field(TeamNode,
                                      team_id=graphene.NonNull(graphene.ID))
    my_team_member = DjangoFilterConnectionField(ProfileNode)
    all_team_board = DjangoFilterConnectionField(TeamBoardNode)
    my_team_trainings = DjangoFilterConnectionField(TrainingNode)
    my_team_schedules = DjangoFilterConnectionField(ScheduleNode)
    my_team_finished_schedules = DjangoFilterConnectionField(FinishedScheduleMemberNode)
    my_team_posts = DjangoFilterConnectionField(PostNode)

    @login_required
    def resolve_my_profile(self, info, **kwargs):
        return Profile.objects.get(user=info.context.user.id)

    @login_required
    def resolve_one_team_from_name(self, info, **kwargs):
        name = kwargs.get('name')
        password = kwargs.get('password')
        if name is not None and password is not None:
            return Team.objects.get(name=name, password=password)

    @login_required
    def resolve_one_team_from_id(self, info, **kwargs):
        team_id = from_global_id(kwargs.get('team_id'))[1]
        return Team.objects.get(id=team_id)

    @login_required
    @user_passes_test(lambda use: use.profile.is_coach)
    def resolve_my_team_member(self, info, **kwargs):
        return Profile.objects.filter(team_board=info.context.user.profile.team_board, is_guest=False).order_by(
            '-join_at')

    @login_required
    def resolve_my_team_trainings(self, info, **kwargs):
        return Training.objects.filter(team_board=info.context.user.profile.team_board).order_by('-created_at')

    @login_required
    def resolve_my_team_schedules(self, info, **kwargs):
        return Schedule.objects.filter(team_board=info.context.user.profile.team_board).order_by('-created_at')

    @login_required
    @user_passes_test(lambda use: use.profile.is_coach)
    def resolve_my_team_finished_schedules(self, info, **kwargs):
        return FinishedScheduleMember.objects.filter(schedule__team_board=info.context.user.profile.team_board)

    @login_required
    def resolve_all_team_board(self, info, **kwargs):
        return TeamBoard.objects.filter(team__is_limit_join=False).order_by('-join_count')

    @login_required
    def resolve_my_team_posts(self, info, **kwargs):
        return Post.objects.filter(team_board=info.context.user.profile.team_board).order_by('-created_at')