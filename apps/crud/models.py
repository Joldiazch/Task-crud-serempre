from django.db import models

class Task(models.Model):
    """ Task representation model  """
    title = models.CharField(max_length=32, null=True)
    description = models.CharField(max_length=500, null=True)
    estimated_time = models.IntegerField(null=True)
    worked_time = models.FloatField(null=True)
    finished = models.BooleanField(default=False)
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)


    def __str__(self):
        return self.title

    class Meta:
        db_table = ''
        managed = True
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'