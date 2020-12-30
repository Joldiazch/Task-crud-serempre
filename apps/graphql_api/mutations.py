import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from graphene.types import generic

# inport Models
from apps.crud.models import Task
# import inputs
from . inputs import TaskInput

class CreateTask(graphene.Mutation):
    class Arguments:
        input = TaskInput(required=True)

    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input=None):
        try:
            task = Task.objects.create(
                title = input.title,
                description = input.description,
                estimated_time = input.estimated_time,
                worked_time = input.worked_time,
                latitude = input.latitude,
                longitude = input.longitude
            )
            res = True
        except:
            res = False

        return CreateTask(ok=res)

class UpdateTask(graphene.Mutation):
    class Arguments:
        input = TaskInput(required=True)

    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input=None):
        try:
            task = Task.objects.filter(id=input.id).update(
                title = input.title,
                description = input.description,
                estimated_time = input.estimated_time
            )
            res = True
        except:
            res = False

        return CreateTask(ok=res)

class Mutation(graphene.ObjectType):
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()