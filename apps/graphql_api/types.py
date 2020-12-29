import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from graphene.types import generic

# Inport models
from apps.crud.models import Task

class TaskType(DjangoObjectType):
    class Meta:
        model = Task