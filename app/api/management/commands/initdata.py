from django.core.management import BaseCommand, call_command
from api.models import CustomUser

class Command(BaseCommand):
    help = "DEV COMMAND: Fill databasse with a set of data for testing purposes"

    def handle(self, *args, **options):
        call_command('loaddata', 'initial_data')
        for user in CustomUser.objects.all():
            user.set_password(user.password)
            user.save()