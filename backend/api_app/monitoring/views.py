from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import SmartContract
from .serializers import SmartContractSerializer

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class SmartContractList(generics.ListAPIView):
    queryset = SmartContract.objects.all()
    serializer_class = SmartContractSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class SmartContractCreate(generics.CreateAPIView):
    queryset = SmartContract.objects.all()
    serializer_class = SmartContractSerializer
    permission_classes = [IsAuthenticated]

class SmartContractRetrieve(generics.RetrieveAPIView):
    queryset = SmartContract.objects.all()
    serializer_class = SmartContractSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class SmartContractUpdate(generics.UpdateAPIView):
    queryset = SmartContract.objects.all()
    serializer_class = SmartContractSerializer
    permission_classes = [IsAuthenticated, IsOwner]

class SmartContractDelete(generics.DestroyAPIView):
    queryset = SmartContract.objects.all()
    serializer_class = SmartContractSerializer
    permission_classes = [IsAuthenticated, IsOwner]


