import json
import logging
import os

import jwt
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ObjectDoesNotExist

from authentication.models import User
from authentication.organizations.models import Membership, Organization

logger = logging.getLogger(__name__)


class NotificationsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.path_ = os.path.join(settings.BASE_DIR, "configuration", "log.txt")

        self.owner_organization_id = self.scope["url_route"]["kwargs"][
            "owner_organization_id"
        ]
        self.user = await self.get_user()

        if not self.user.is_authenticated:
            await self.close()
        elif not await self.is_member_of_organization():
            await self.close()
        else:
            await self.channel_layer.group_add(
                self.owner_organization_id, self.channel_name
            )
            await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.owner_organization_id, self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def send_notification(self, event):
        notification = event["notification"]

        await self.send(text_data=json.dumps(notification))

    @database_sync_to_async
    def get_user(self):
        try:
            query_string = self.scope["query_string"].decode().split("&")

            query = {i.split("=")[0]: i.split("=")[1] for i in query_string}

            token_key = query.get("token")

            if not token_key:
                return AnonymousUser()
            decoded_token = jwt.decode(
                token_key, settings.SECRET_KEY, algorithms=["HS256"]
            )

            user_id = decoded_token.get("user_id")
            if user_id:
                return User.objects.get(id=user_id)

            return AnonymousUser()
        except (AttributeError, IndexError, ObjectDoesNotExist):
            return AnonymousUser()

    @database_sync_to_async
    def is_member_of_organization(self):
        org = Organization.objects.get(id=self.owner_organization_id)
        return Membership.is_member(user=self.user, organization=org)
