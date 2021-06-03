from graphene_django import DjangoObjectType
from graphene import relay

from api.models import CustomUser, Profile, Team, TeamBoard, Training, Schedule, FinishedScheduleMember, Post

class UserNode(DjangoObjectType):
    class Meta:
        model = CustomUser
        filter_fields = {
            'email': ['exact'],
        }
        interfaces = (relay.Node,)

class ProfileNode(DjangoObjectType):
    class Meta:
        model = Profile
        filter_fields = {
            'nickname': ['exact', 'icontains'],
        }
        interfaces = (relay.Node,)

class TeamNode(DjangoObjectType):
    class Meta:
        model = Team
        filter_fields = {
            'id': ['exact'],
            'name': ['exact'],
            'password': ['exact'],
        }
        interfaces = (relay.Node,)

class TeamBoardNode(DjangoObjectType):
    class Meta:
        model = TeamBoard
        filter_fields = {
            'team__id': ['exact'],
        }
        interfaces = (relay.Node,)

class TrainingNode(DjangoObjectType):
    class Meta:
        model = Training
        filter_fields = {
            'title': ['exact', 'icontains'],
        }
        interfaces = (relay.Node,)

class ScheduleNode(DjangoObjectType):
    class Meta:
        model = Schedule
        filter_fields = {
            'date': ['exact'],
            'training__title': ['exact'],
        }
        interfaces = (relay.Node,)

class FinishedScheduleMemberNode(DjangoObjectType):
    class Meta:
        model = FinishedScheduleMember
        filter_fields = {
            'schedule__id': ['exact'],
            'profile__id': ['exact'],
        }
        interfaces = (relay.Node, )

class PostNode(DjangoObjectType):
    class Meta:
        model = Post
        filter_fields = {
            'text': ['exact'],
            'team_board_id': ['exact'],
        }
        interfaces = (relay.Node,)