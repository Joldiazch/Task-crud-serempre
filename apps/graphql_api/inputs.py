import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from graphene.types import generic

#Create inputs Objets types
class TaskInput(graphene.InputObjectType):
    title = graphene.String()
    description = graphene.String()
    estimated_time = graphene.Int()
    worked_time = graphene.Float()
    latitude = graphene.Float()
    longitude = graphene.Float()
    id = graphene.Int()
    finished = graphene.Boolean()