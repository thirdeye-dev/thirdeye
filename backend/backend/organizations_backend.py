from rest_framework.exceptions import AuthenticationFailed
from organizations.backends import BaseBackend

class CustomOrganizationBackend(BaseBackend):
    def redirect_to_login(self, request):
        raise AuthenticationFailed('User is not authenticated', code=401)

    def authenticate(self, request):
        user = request.user
        if not user.is_authenticated:
            raise AuthenticationFailed('User is not authenticated', code=401)

        # Return the user object if authentication succeeds
        return user