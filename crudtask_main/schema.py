import graphene

import apps.graphql_api.schema

class Query(apps.graphql_api.schema.Query, graphene.ObjectType):
    # This class will inherit from multiple Queries
    # as we begin to add more apps to our project
    pass

class Mutation(apps.graphql_api.schema.Mutation, graphene.ObjectType):
    # This class will inherit from multiple Queries
    # as we begin to add more apps to our project
    pass

""" schema = graphene.Schema(query=Query, mutation=Mutation) """
schema = graphene.Schema(query=Query)