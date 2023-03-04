import os
import sys
import json
import hashlib

from django.conf import settings
from rest_framework import serializers as rfs
from cache_memoize import cache_memoize


class IOCSerializer(rfs.Serializer):
    name = rfs.CharField(required=True)
    entrypoint = rfs.CharField(required=True)
    description = rfs.CharField(required=True)
    type = rfs.CharField(required=True)
    params = rfs.JSONField(required=True)

    CONFIG_FILE_NAME = "iocs.json"

    @classmethod
    def _get_config_path(cls) -> str:
        return os.path.join(settings.BASE_DIR, "configuration", cls.CONFIG_FILE_NAME)

    @classmethod
    def _read_config(cls):
        config_path = cls._get_config_path()
        with open(config_path) as f:
            config_dict = json.load(f)
        return config_dict

    @classmethod
    def _verify_params(cls, params):
        for param in params:
            if params.get(param) not in ["int", "str", "float"]:
                raise rfs.ValidationError(
                    f"Invalid type {param.get('type')} for param {param.get('name')}"
                )

    @classmethod
    def _md5_config_file(cls) -> str:
        """
        Returns md5sum of config file.
        """
        fpath = cls._get_config_path()
        with open(fpath, "r") as fp:
            buffer = fp.read().encode("utf-8")
            md5hash = hashlib.md5(buffer).hexdigest()
        return md5hash

    @classmethod
    @cache_memoize(
        timeout=sys.maxsize,
        args_rewrite=lambda cls: f"{cls.__name__}-{cls._md5_config_file()}",
    )
    def read_and_verify_config(cls) -> dict:
        """
        Returns verified config.
        This function is memoized for the md5sum of the JSON file.
        """
        config_dict = cls._read_config()

        serializer_errors = {}
        for key, config in config_dict.items():
            new_config = {"name": key, **config}
            serializer = cls(data=new_config)
            if serializer.is_valid():
                cls._verify_params(serializer.validated_data.get("params"))
                config_dict[key] = serializer.data
            else:
                serializer_errors[key] = serializer.errors

        if bool(serializer_errors):
            logger.error(f"{cls.__name__} serializer failed: {serializer_errors}")
            raise rfs.ValidationError(serializer_errors)

        return config_dict
