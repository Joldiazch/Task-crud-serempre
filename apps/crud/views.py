from django.shortcuts import render
from django.http import HttpResponse
import json
# Create your views here.

def taskLits(request):
    """ Only render html. all the magic is using graphql api """
    return render(request, 'index.html')