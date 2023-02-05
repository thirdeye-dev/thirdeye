from rest_framework import serializers
from .models import SmartContract

class SmartContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = SmartContract
        fields = '__all__'
        read_only_fields = ('id', 'owner')

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)