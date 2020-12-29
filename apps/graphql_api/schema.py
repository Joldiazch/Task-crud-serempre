import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from graphene.types import generic

from . import queries
from . import mutations

class Query(queries.Query):
    pass

class Mutation(mutations.Mutation):
    pass