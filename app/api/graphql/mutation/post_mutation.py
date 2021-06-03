import graphene

from graphql import GraphQLError
from graphene import relay
from graphql_jwt.decorators import login_required, user_passes_test
from graphql_relay import from_global_id

from api.models import Post
from api.utils.validator import validate_post_text
from api.graphql.node import PostNode

class CreatePostMutation(relay.ClientIDMutation):
    class Input:
        text = graphene.String(required=True)

    post = graphene.Field(PostNode)

    @login_required
    @user_passes_test(lambda use: not use.profile.is_guest)
    def mutate_and_get_payload(root, info, **input):
        text = validate_post_text(input.get("text"))
        post = Post(
            text=text,
            team_board=info.context.user.profile.team_board,
            profile=info.context.user.profile
        )
        post.save()

        return CreatePostMutation(post=post)

class DeletePostMutation(relay.ClientIDMutation):
    class Input:
        post_id = graphene.ID(required=True)

    post = graphene.Field(PostNode)

    @login_required
    @user_passes_test(lambda use: not use.profile.is_guest)
    def mutate_and_get_payload(root, info, **input):
        post = Post.objects.get(id=from_global_id(input.get('post_id'))[1])
        if post.team_board != info.context.user.profile.team_board:
            raise GraphQLError('Cannot delete other team post')
        if info.context.user.profile.is_coach:
            post.delete()
        elif post.profile == info.context.user.profile:
            post.delete()
        else:
            raise GraphQLError("You do not have permission to perform this action")

        return CreatePostMutation(post=None)