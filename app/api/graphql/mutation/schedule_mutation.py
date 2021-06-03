import graphene
import datetime

from graphql import GraphQLError
from graphene import relay
from graphql_jwt.decorators import login_required, user_passes_test
from graphql_relay import from_global_id

from api.models import Training, Schedule
from api.graphql.node import ScheduleNode

class CreateScheduleMutation(relay.ClientIDMutation):
    class Input:
        training_id = graphene.ID(required=True)
        date = graphene.Date(required=True)

    schedule = graphene.Field(ScheduleNode)

    @login_required
    @user_passes_test(lambda use: use.profile.is_coach)
    def mutate_and_get_payload(root, info, **input):
        training = Training.objects.get(id=from_global_id(input.get('training_id'))[1])
        if training.team_board != info.context.user.profile.team_board:
            raise GraphQLError("Cannot select other team training")
        if input.get('date') < datetime.date.today():
            raise GraphQLError("Cannot register past date")
        schedule = Schedule(
            training=training,
            team_board=info.context.user.profile.team_board,
            date=input.get('date')
        )
        schedule.save()
        training.use_count += 1
        training.save()

        return CreateScheduleMutation(schedule=schedule)

class CreateManySchedulesMutation(relay.ClientIDMutation):
    class Input:
        training_id = graphene.ID(required=True)
        start_date = graphene.Date(required=True)
        end_date = graphene.Date(required=True)
        day_of_week = graphene.String(required=True)

    schedule = graphene.Field(ScheduleNode)

    @login_required
    @user_passes_test(lambda use: use.profile.is_coach)
    def mutate_and_get_payload(root, info, **input):
        start = input.get('start_date')
        end = input.get('end_date')
        training = Training.objects.get(id=from_global_id(input.get('training_id'))[1])
        day_of_week = input.get('day_of_week')

        if training.team_board != info.context.user.profile.team_board:
            raise GraphQLError("Cannot select other team training")
        if start > end :
            raise GraphQLError("Please select the period correctly")
        if start < datetime.date.today():
            raise GraphQLError("Cannot register past date")
        while start <= end:
            if str(start.weekday()) in day_of_week:
                schedule = Schedule(
                    team_board=info.context.user.profile.team_board,
                    date=start
                )
                schedule.training = training
                schedule.save()
                training.use_count += 1
                training.save()
            start += datetime.timedelta(days=1)
        return CreateManySchedulesMutation(schedule=None)

class DeleteScheduleMutation(relay.ClientIDMutation):
    class Input:
        schedule_id = graphene.ID(required=True)

    schedule = graphene.Field(ScheduleNode)

    @login_required
    @user_passes_test(lambda use: use.profile.is_coach)
    def mutate_and_get_payload(root, info, **input):
        schedule = Schedule.objects.get(
            id=from_global_id(input.get('schedule_id'))[1]
        )
        if schedule.date < datetime.date.today():
            raise GraphQLError("Cannot delete past schedule")
        if schedule.team_board != info.context.user.profile.team_board:
            raise GraphQLError("Cannot delete other team schedule")
        training = Training.objects.get(id=schedule.training.id)
        training.use_count -= 1
        training.save()
        schedule.delete()

        return DeleteScheduleMutation(schedule=None)

class DeleteManySchedulesMutation(relay.ClientIDMutation):
    class Input:
        start_date = graphene.Date(required=True)
        end_date = graphene.Date(required=True)
        training_id = graphene.ID()

    schedule = graphene.Field(ScheduleNode)

    @login_required
    @user_passes_test(lambda use: use.profile.is_coach)
    def mutate_and_get_payload(root, info, **input):
        start = input.get('start_date')
        end = input.get('end_date')
        if start > end:
            raise GraphQLError("Please select the period correctly")
        if start < datetime.date.today():
            raise GraphQLError("Cannot delete past schedules")
        if input.get('training_id') is not None:
            training = Training.objects.get(id=from_global_id(input.get('training_id'))[1])
            training.use_count -= 1
            training.save()
            schedules = Schedule.objects.filter(date__range=(start, end), training=training, team_board=info.context.user.profile.team_board)
        else:
            schedules = Schedule.objects.filter(date__range=(start, end), team_board=info.context.user.profile.team_board)
        schedules.delete()
        return DeleteScheduleMutation(schedule=None)