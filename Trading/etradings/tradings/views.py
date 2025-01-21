from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Store
from .serializers import StoreSerializer

class StoresViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.filter(active=True)
    serializer_class = StoreSerializer

    def get_permissions(self):
        if self.action=='list':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated]

def index(request):
    return render(request, template_name='index.html', context={
        'name':'Tú là thằng dbrr'
    })

# Create your views here.
