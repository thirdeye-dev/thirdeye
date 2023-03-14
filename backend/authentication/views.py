import os
import logging
import requests

from authlib.integrations.base_client import OAuthError
from authlib.oauth2 import OAuth2Error
from django.contrib.auth import get_user_model
from django.http import HttpResponsePermanentRedirect
from django.shortcuts import redirect
from rest_framework import generics, permissions, status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from organizations.models import OrganizationUser

from .oauth import oauth
from .serializers import (
    LoginSerializer,
    LogoutSerializer,
    RegisterSerializer,
    UserSerializer,
)

logger = logging.getLogger(__name__)


User = get_user_model()


class CustomRedirect(HttpResponsePermanentRedirect):
    allowed_schemes = [os.environ.get("APP_SCHEME"), "http", "https"]


class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data
        user = User.objects.get(email=user_data["email"])

        return Response(
            {
                "status": "successful",
            },
            status=status.HTTP_201_CREATED,
        )


class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.data
        data["username"] = serializer.validated_data["username"]
        return Response(data, status=status.HTTP_200_OK)


class LogoutAPIView(generics.GenericAPIView):
    serializer_class = LogoutSerializer

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"status": "successful"}, status=status.HTTP_200_OK)


class MeAPIView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return User.objects.filter(id=user.id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        user_data = serializer.data[0]

        org_users = OrganizationUser.objects.filter(user=request.user)
        org_data = []
        for ou in org_users:
            org_info = {'id': ou.organization.id, 'name': ou.organization.name}
            if ou.is_admin:
                org_info['role'] = 'admin'
            if ou.is_owner:
                org_info['role'] = 'owner'
            org_data.append(org_info)

        user_data['organizations'] = org_data
        return Response(user_data)


def google_login(request):
    redirect_uri = request.build_absolute_uri(reverse("oauth_google_callback")).replace(
        "0.0.0.0:8000", "localhost:3000/api"
    )
    try:
        return oauth.google.authorize_redirect(request, redirect_uri)
    except AttributeError as error:
        if "No such client: " in str(error):
            raise AuthenticationFailed("Google OAuth is not configured.")
        raise error
    
def github_login(request):
    redirect_uri = request.build_absolute_uri(reverse("oauth_github_callback")).replace(
        "0.0.0.0:8000", "localhost:3000/api"
    )
    try:
        return oauth.github.authorize_redirect(request, redirect_uri)
    except AttributeError as error:
        if "No such client: " in str(error):
            raise AuthenticationFailed("Github OAuth is not configured.")
        raise error


class GoogleLoginCallbackView(APIView):
    @staticmethod
    def validate_and_return_user(request):
        try:
            token = oauth.google.authorize_access_token(request)
        except (
            OAuthError,
            OAuth2Error,
        ):
            # Not giving out the actual error as we risk exposing the client secret
            raise AuthenticationFailed("OAuth authentication error.")

        user = token.get("userinfo")
        user_email = user.get("email")
        user_name = user.get("name")
        # image = user.get("image").get("url")

        try:
            return User.objects.get(email=user_email)
        except User.DoesNotExist:
            logging.info("[Google Oauth] User does not exist. Creating new one.")
            return User.objects.create_user(
                email=user_email,
                username=user_name,
                password=None,
                auth_provider="google",
                # avatar=image,
            )

    def get(self, request):
        return self.post(request)

    def post(self, request):
        user = self.validate_and_return_user(request)
        print(user)

        tokens = user.tokens()
        access_token = tokens.get("access")
        refresh_token = tokens.get("refresh")

        # Uncomment this for local testing
        return redirect(
            "http://localhost:3000/auth/social?access"
            f"={access_token}&refresh={refresh_token}&username={user.username}"
        )
        # return redirect(self.request.build_absolute_uri(f"/login?token={token}"))

class GithubLoginCallbackView(APIView):
    @staticmethod
    def validate_and_return_user(request):
        try:
            token = oauth.github.authorize_access_token(request)
        except (
            OAuthError,
            OAuth2Error,
        ):
            # Not giving out the actual error as we risk exposing the client secret
            raise AuthenticationFailed("OAuth authentication error.")

        resp = oauth.github.get('user', token=token)
        resp.raise_for_status()
        profile = resp.json()
        user_name = profile.get("name")

        # get user emails from github
        emails_resp = oauth.github.get('user/emails', token=token)
        emails_resp.raise_for_status()
        emails = emails_resp.json()

        # find the primary email
        primary_emails = [e for e in emails if e.get('primary') and e.get('verified')]
        user_email = primary_emails[0].get('email') if primary_emails else None

        # fallback to the first email
        if not user_email and emails:
            user_email = emails[0].get('email')

        try:
            return User.objects.get(email=user_email)
        except User.DoesNotExist:
            logging.info(
                "[Github Oauth] User does not exist. Creating new one.\n"
                f"{profile}"
            )
            return User.objects.create_user(
                email=user_email,
                username=user_name,
                password=None,
                auth_provider="github",
                # avatar=image,
            )

    def get(self, request):
        return self.post(request)

    def post(self, request):
        user = self.validate_and_return_user(request)
        print(user)

        tokens = user.tokens()
        access_token = tokens.get("access")
        refresh_token = tokens.get("refresh")

        # Uncomment this for local testing
        return redirect(
            "http://localhost:3000/auth/social?access"
            f"={access_token}&refresh={refresh_token}&username={user.username}"
        )
        # return redirect(self.request.build_absolute_uri(f"/login?token={token}"))


