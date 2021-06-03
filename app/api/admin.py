from django.contrib import admin
from . import models

admin.site.register(models.CustomUser)
admin.site.register(models.Profile)
admin.site.register(models.Team)
admin.site.register(models.Training)
admin.site.register(models.Schedule)
admin.site.register(models.FinishedScheduleMember)