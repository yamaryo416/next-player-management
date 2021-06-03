import graphene
import datetime

from graphql import GraphQLError
from graphene import relay
from graphql_jwt.decorators import login_required, user_passes_test
from graphql_relay import from_global_id

from api.models import Profile, Schedule, FinishedScheduleMember
from api.graphql.node import FinishedScheduleMemberNode

class CreateFinishedScheduleMemberMutation(relay.ClientIDMutation):
    class Input:
        schedule_id = graphene.ID(required=True)

    finished_schedule_member = graphene.Field(FinishedScheduleMemberNode)

    @login_required
    @user_passes_test(lambda use: not use.profile.is_guest)
    def mutate_and_get_payload(root, info, **input):
        schedule = Schedule.objects.get(id=from_global_id(input.get('schedule_id'))[1])
        if schedule.team_board != info.context.user.profile.team_board:
            raise GraphQLError("Cannot finish other team schedule")
        if FinishedScheduleMember.objects.filter(schedule=schedule, profile=info.context.user.profile).exists():
            raise GraphQLError("Schedule is already finished")
        if schedule.date != datetime.date.today():
            raise GraphQLError("Cannot finish any schedule other than today")
        finished_schedule_member = FinishedScheduleMember(
            schedule=schedule,
            training=schedule.training,
            profile=info.context.user.profile
        )
        finished_schedule_member.save()
        schedule.finished_count += 1
        schedule.save()
        profile = info.context.user.profile
        profile.finished_schedule_count += 1
        profile.save()

        return CreateFinishedScheduleMemberMutation(finished_schedule_member=finished_schedule_member)

class DeleteFinishedScheduleMemberMutation(relay.ClientIDMutation):
    class Input:
        schedule_id = graphene.ID(required=True)

    finished_schedule_member = graphene.Field(FinishedScheduleMemberNode)

    @login_required
    def mutate_and_get_payload(root, info, **input):
        schedule = Schedule.objects.get(id=from_global_id(input.get('schedule_id'))[1])
        if not FinishedScheduleMember.objects.filter(schedule=schedule, profile=info.context.user.profile).exists():
            raise GraphQLError("Schedule is not finished")
        if schedule.date != datetime.date.today():
            raise GraphQLError("Cannot delete finish schedule other than today")
        finished_schedule_member = FinishedScheduleMember.objects.get(
            schedule=schedule,
            profile=info.context.user.profile
        )
        finished_schedule_member.delete()
        schedule.finished_count -= 1
        schedule.save()
        profile = Profile.objects.get(id=info.context.user.profile.id)
        profile.finished_schedule_count -= 1
        profile.save()

        return DeleteFinishedScheduleMemberMutation(finished_schedule_member=None)