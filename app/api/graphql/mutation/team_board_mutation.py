import graphene

from graphql import GraphQLError
from graphene import relay
from graphql_jwt.decorators import login_required, user_passes_test
from graphql_relay import from_global_id

from api.models import Profile
from api.utils.validator import validate_introduction
from api.graphql.node import TeamBoardNode

class UpdateTeamBoardIntroductionMutation(relay.ClientIDMutation):
    class Input:
        introduction = graphene.String(required=True)

    team_board = graphene.Field(TeamBoardNode)

    @login_required
    @user_passes_test(lambda use: use.profile.is_coach)
    def mutate_and_get_payload(root, info, **input):
        team_board = info.context.user.profile.team_board
        team_board.introduction = validate_introduction(input.get("introduction"))
        team_board.save()

        return UpdateTeamBoardIntroductionMutation(team_board=team_board)

class UpdateTeamBoardCoachMutation(relay.ClientIDMutation):
    class Input:
        profile_id = graphene.ID(required=True)

    team_board = graphene.Field(TeamBoardNode)

    @login_required
    @user_passes_test(lambda use: use.profile.is_coach)
    def mutate_and_get_payload(root, info, **input):
        team_board = info.context.user.profile.team_board
        one_profile = Profile.objects.get(id=from_global_id(input.get('profile_id'))[1])
        if one_profile.team_board != team_board:
            raise GraphQLError("Profile is not join my team")
        team_board.coach = one_profile.nickname
        team_board.save()
        one_profile.is_coach = True
        one_profile.save()
        my_profile = info.context.user.profile
        my_profile.is_coach = False
        my_profile.save()

        return UpdateTeamBoardCoachMutation(team_board=team_board)