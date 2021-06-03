import datetime

from factory.django import DjangoModelFactory
from factory import Sequence, Trait, SubFactory, RelatedFactory

from api.models import CustomUser, Profile, Team, TeamBoard, Training, Schedule, FinishedScheduleMember, Post

class ProfileFactory(DjangoModelFactory):
    class Meta:
        model = Profile

    nickname = Sequence(lambda n: 'user{0}'.format(n))
    user = SubFactory('api.utils.factory.UserFactory', profile=None)
    is_coach = False
    is_guest = False
    created_at = Sequence(lambda n: datetime.datetime(2020, 1, 1, 0, 0, 0, 0000) + datetime.timedelta(days=n))

class UserFactory(DjangoModelFactory):
    class Meta:
        model = CustomUser

    profile = RelatedFactory(ProfileFactory, factory_related_name='user')
    email = Sequence(lambda n: 'user{0}@example.com'.format(n))
    password = Sequence(lambda n: 'password{0}'.format(n))

class TeamBoardFactory(DjangoModelFactory):
    class Meta:
        model = TeamBoard

    introduction = ""
    join_count = 1

class TeamFactory(DjangoModelFactory):
    class Meta:
        model = Team

    name = Sequence(lambda n: 'team{0}'.format(n))
    team_board = RelatedFactory(TeamBoardFactory, factory_related_name="team")
    is_limit_join = False
    password = "0000"

class TrainingFactory(DjangoModelFactory):
    class Meta:
        model = Training

    title = Sequence(lambda n: 'training{0}'.format(n))
    load = 0
    count = 0
    distance = 0
    description = ""
    icon_number = 0
    use_count = 0
    is_general = False
    created_at = Sequence(lambda n: datetime.datetime(2020, 1, 1, 0, 0, 0, 0000) + datetime.timedelta(days=n))

class ScheduleFactory(DjangoModelFactory):
    class Meta:
        model = Schedule

    date = Sequence(lambda n: datetime.datetime.today() + datetime.timedelta(days=n))
    finished_count = 0
    created_at = Sequence(lambda n: datetime.datetime(2020, 1, 1, 0, 0, 0, 0000) + datetime.timedelta(days=n))

class FinishedScheduleMemberFactory(DjangoModelFactory):
    class Meta:
        model = FinishedScheduleMember

    created_at = Sequence(lambda n: datetime.datetime(2020, 1, 1, 0, 0, 0, 0000) + datetime.timedelta(days=n))

class PostFactory(DjangoModelFactory):
    class Meta:
        model = Post

    created_at = Sequence(lambda n: datetime.datetime(2020, 1, 1, 0, 0, 0, 0000) + datetime.timedelta(days=n))
