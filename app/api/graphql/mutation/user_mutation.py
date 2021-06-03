import graphene
import random, string

from graphene import relay
from graphql_jwt.decorators import login_required, user_passes_test
from api.models import CustomUser, Profile
from api.utils.validator import validate_name, validate_email, validate_user_password
from api.graphql.node import UserNode

class CreateGeneralUserMutation(relay.ClientIDMutation):
    class Input:
        nickname = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(UserNode)

    def mutate_and_get_payload(root, info, **input):
        nickname = validate_name(input.get('nickname'))
        email = validate_email(input.get('email'))
        password = validate_user_password(input.get('password'))
        user = CustomUser(
            email=email,
        )
        user.set_password(password)

        user.save()
        profile = Profile(
            nickname=nickname,
            user=user
        )
        profile.save()

        return CreateGeneralUserMutation(user=user)

class CreateGuestUserMutation(relay.ClientIDMutation):
    class Input:
        password = graphene.String(required=True)

    user = graphene.Field(UserNode)

    def mutate_and_get_payload(root, info, **input):
        random_string_list = [random.choice(string.ascii_letters + string.digits) for i in range(10) ]
        random_email = ''.join(random_string_list) + "@trainingschedule.com"
        password = validate_user_password(input.get('password'))
        user = CustomUser(
            email=random_email
        )
        user.set_password(password)
        user.save()
        profile = Profile(
            nickname="ゲスト",
            user=user,
            is_guest=True
        )
        profile.save()

        return CreateGuestUserMutation(user=user)

class DeleteUserMutation(relay.ClientIDMutation):
    class Input:
        confirm = graphene.Boolean(required=True)

    user = graphene.Field(UserNode)

    @login_required
    @user_passes_test(lambda use: not use.profile.is_coach)
    def mutate_and_get_payload(root, info, **input):
        user = info.context.user
        if (user.profile.team_board is not None) & (not user.profile.is_guest):
            team_board = user.profile.team_board
            team_board.join_count -= 1
            team_board.save()
        user.delete()

        return DeleteUserMutation(user=None)