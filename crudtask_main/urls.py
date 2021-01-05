from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from graphene_django.views import GraphQLView

# Inport Views
from apps.crud.views import taskLits

urlpatterns = [
    path('admin/', admin.site.urls),

    path('graphql/', csrf_exempt(GraphQLView.as_view())),
    path('explore/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
    path('tasks/', taskLits)
]
