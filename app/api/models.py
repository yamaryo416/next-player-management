from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None):

        if not email:
            raise ValueError('email is must')

        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email

class Team(models.Model):
    for_number_regex = RegexValidator(regex=r'^[0-9]{4}', message=("四桁の数字を入力してください。"))

    name = models.CharField(max_length=20, unique=True, blank=False, null=False)
    is_limit_join = models.BooleanField(default=False)
    password = models.CharField(validators=[for_number_regex], max_length=4)

    def __str__(self):
        return self.name

class Profile(models.Model):
    nickname = models.CharField(max_length=20)
    user = models.OneToOneField(
        CustomUser, related_name="profile",
        on_delete=models.CASCADE
    )
    team_board = models.ForeignKey(
        'api.TeamBoard', related_name="member",
        blank=True, null=True,
        on_delete=models.SET_NULL
    )
    finished_schedule_count = models.IntegerField(default=0)
    is_guest = models.BooleanField(default=False)
    is_coach = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    join_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.nickname

class TeamBoard(models.Model):
    introduction = models.CharField(max_length=100)
    team = models.OneToOneField(
        Team, related_name="team_board",
        on_delete=models.CASCADE
    )
    join_count = models.IntegerField(default=1)
    coach = models.CharField(max_length=20)

class Training(models.Model):
    title = models.CharField(max_length=20)
    load = models.IntegerField(default=0)
    count = models.IntegerField(default=0)
    distance = models.IntegerField(default=0)
    description = models.CharField(max_length=60 ,default="")
    icon_number = models.IntegerField(default=0)
    team_board = models.ForeignKey(
        TeamBoard, related_name="trainings",
        blank=True, null=True,
        on_delete=models.SET_NULL
    )
    use_count = models.IntegerField(default=0)
    is_general = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Schedule(models.Model):
    training = models.ForeignKey(
        Training, related_name="schedules",
        on_delete=models.CASCADE
    )
    team_board = models.ForeignKey(
        TeamBoard, related_name="schedules",
        blank=True, null=True,
        on_delete=models.SET_NULL
    )
    date = models.DateField(default=timezone.now)
    finished_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.training_schedule.title

class FinishedScheduleMember(models.Model):
    schedule = models.ForeignKey(
        Schedule, related_name="finished_schedules",
        on_delete=models.CASCADE
    )
    training = models.ForeignKey(
        Training, related_name="finished_schedules",
        on_delete=models.CASCADE
    )
    profile = models.ForeignKey(
        Profile, related_name="finished_schedules",
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

class Post(models.Model):
    text = models.CharField(max_length=100)
    team_board = models.ForeignKey(
        TeamBoard, related_name="posts",
        on_delete=models.CASCADE
    )
    profile = models.ForeignKey(
        Profile, related_name="posts",
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

