import graphene
import datetime

from graphene import relay
from graphql_jwt.decorators import login_required, user_passes_test

from api.models import Team, TeamBoard
from api.utils.validator import validate_name, validate_team_password
from api.graphql.node import TeamNode

class CreateTeamMutation(relay.ClientIDMutation):
    class Input:
        name = graphene.String(required=True)
        is_limit_join = graphene.Boolean(required=True)
        password = graphene.String(required=True)

    team = graphene.Field(TeamNode)

    @login_required
    @user_passes_test(lambda use: not use.profile.is_guest)
    @user_passes_test(lambda use: use.profile.team_board is None)
    def mutate_and_get_payload(root, info, **input):
        name = validate_name(input.get('name'))
        password = validate_team_password(input.get('password'))
        team = Team(
            name=name,
            is_limit_join=input.get('is_limit_join'),
        )
        if input.get('is_limit_join'):
            team.password = password
        else:
            team.password = "0000"
        team.save()
        team_board = TeamBoard(
            introduction="",
            team=team,
            coach=info.context.user.profile.nickname,
        )
        team_board.save()
        profile = info.context.user.profile
        profile.team_board = team_board
        profile.join_at = datetime.datetime.now()
        profile.is_coach = True
        profile.save()

        return CreateTeamMutation(team=team)

class UpdateTeamMutation(relay.ClientIDMutation):
    class Input:
        name = graphene.String(required=True)
        is_limit_join = graphene.Boolean(required=True)
        password = graphene.String(required=True)

    team = graphene.Field(TeamNode)

    @login_required
    @user_passes_test(lambda use: use.profile.is_coach)
    def mutate_and_get_payload(root, info, **input):
        team = info.context.user.profile.team_board.team
        team.name = validate_name(input.get('name'))
        team.is_limit_join = input.get('is_limit_join')
        if input.get('is_limit_join'):
            team.password = validate_team_password(input.get('password'))
        else:
            team.password = "0000"
        team.save()

        return UpdateTeamMutation(team=team)