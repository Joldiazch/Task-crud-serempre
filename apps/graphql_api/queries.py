import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from graphene.types import generic

# import types
from . import types

# Inport models
from apps.crud.models import Task

class Query(ObjectType):
    all_tasks = graphene.List(types.TaskType)
    task = graphene.Field(types.TaskType, task_id=graphene.Int())


    def resolve_all_tasks(self, info, **kwargs):
        """ Return all Task objects storage on DB """
        return Task.objects.all().order_by('pk')

    def resolve_task(self, info, **kwargs):
        """ Return specific task with task_id """
        task_id = kwargs.get('task_id')
        try:
            task = Task.objects.get(id=task_id) if task_id else None
        except Task.DoesNotExist:
            task = None

        return task