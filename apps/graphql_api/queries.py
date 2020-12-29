import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from graphene.types import generic

# import types
from . import types

# Inport models
from apps.crud.models import Task

class Query(ObjectType):
    all_tasks = graphene.List(types.TaskType)


    def resolve_all_tasks(self, info, **kwargs):
        return Task.objects.all()