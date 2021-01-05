import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from graphene.types import generic

# inport Models
from apps.crud.models import Task
# import inputs
from . inputs import TaskInput

class CreateTask(graphene.Mutation):
    """
    Mutation used to created a new task 
    """
    class Arguments:
        # For create a new task is necesary Taskinput as input
        input = TaskInput(required=True)

    # return True if an new tas is created or False in other case 
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input=None):
        try:
            """ Try to create new task in other case return False """
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
            task = Task.objects.filter(id=input.id)
            task.update(
                title = input.title if input.title else task[0].title,
                description = input.description if input.description else task[0].description,
                estimated_time = input.estimated_time if input.estimated_time else task[0].estimated_time,
                finished = input.finished if input.finished != None else task[0].finished,
                worked_time = input.worked_time if input.worked_time != None else task[0].worked_time
            )
            res = True
        except:
            res = False

        return UpdateTask(ok=res)

class DeleteTask(graphene.Mutation):
    class Arguments:
        input = TaskInput(required=True)

    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input=None):
        try:
            task = Task.objects.get(id=input.id).delete()
            res = True
        except:
            res = False

        return DeleteTask(ok=res)

class Mutation(graphene.ObjectType):
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    delete_task = DeleteTask.Field()