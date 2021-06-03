import graphene
import datetime

from graphene import relay
from graphql_jwt.decorators import login_required, user_passes_test
from graphql_relay import from_global_id

from api.models import Profile, TeamBoard
from api.utils.validator import validate_name
from api.graphql.node import ProfileNode

class UpdateProfileNicknameMutation(relay.ClientIDMutation):
    class Input:
        nickname = graphene.String(required=True)

    profile = graphene.Field(ProfileNode)

    @login_required
    @user_passes_test(lambda use: not use.profile.is_guest)
    def mutate_and_get_payload(root, info, **input):
        profile = info.context.user.profile
        profile.nickname = validate_name(input.get('nickname'))
        profile.save()
        if info.context.user.profile.is_coach:
            team_board = info.context.user.profile.team_board
            team_board.coach = validate_name(input.get('nickname'))
            team_board.save()

        return UpdateProfileNicknameMutation(profile=profile)

class UpdateProfileTeamBoardMutation(relay.ClientIDMutation):
    class Input:
        team_board_id = graphene.ID(required=True)

    profile = graphene.Field(ProfileNode)

    @login_required
    @user_passes_test(lambda use: use.profile.team_board is None)
    def mutate_and_get_payload(root, info, **input):
        profile = info.context.user.profile
        team_board = TeamBoard.objects.get(id=from_global_id(input.get('team_board_id'))[1])
        profile.team_board = team_board
        profile.join_at = datetime.datetime.now()
        if not profile.is_guest:
            team_board.join_count += 1
            team_board.save()
        profile.save()

        return UpdateProfileTeamBoardMutation(profile=profile)

class DeleteMyProfileTeamBoardMutation(relay.ClientIDMutation):
    class Input:
        confirm = graphene.Boolean(required=True)

    profile = graphene.Field(ProfileNode)

    @login_required
    @user_passes_test(lambda use: not use.profile.is_coach)
    def mutate_and_get_payload(root, info, **input):
        profile = info.context.user.profile
        if not profile.is_guest:
            team_board = profile.team_board
            team_board.join_count -= 1
            team_board.save()
        profile.team_board = None
        profile.save()

        return DeleteMyProfileTeamBoardMutation(profile=profile)

class DeleteOneProfileTeamBoardMutation(relay.ClientIDMutation):
    class Input:
        profile_id = graphene.ID(required=True)

    profile = graphene.Field(ProfileNode)

    @login_required
    @user_passes_test(lambda use: use.profile.is_coach)
    def mutate_and_get_payload(root, info, **input):
        profile = Profile.objects.get(id=from_global_id(input.get('profile_id'))[1])
        team_board = profile.team_board
        team_board.join_count -= 1
        team_board.save()
        profile.team_board = None
        profile.save()

        return DeleteOneProfileTeamBoardMutation(profile=profile)