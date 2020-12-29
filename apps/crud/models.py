from django.db import models

# Create your models here.

class Task(models.Model):
    title = models.CharField(max_length=32)
    description = models.CharField(max_length=500)

    def __str__(self):
        return title

    class Meta:
        db_table = ''
        managed = True
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'