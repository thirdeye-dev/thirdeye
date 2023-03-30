from rest_framework import permissions, viewsets

from .models import SmartContract
from .serializers import SmartContractSerializer


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # user should be authenticated and the owner of the object
        return obj.owner == request.user and request.user.is_authenticated


# add permissions later
class SmartContractViewSet(viewsets.ModelViewSet):
    serializer_class = SmartContractSerializer

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsOwner]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return SmartContract.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
