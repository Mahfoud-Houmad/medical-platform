from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'role', 'cin', 'inp', 'inpe', 'phone','address']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            role=validated_data['role'],
            cin=validated_data.get('cin'),
            inp=validated_data.get('inp'),
            inpe=validated_data.get('inpe'),
            phone=validated_data.get('phone'),
            address=validated_data.get('address'),
        )
        return user

class PharmacieSerializer(serializers.ModelSerializer):
    google_maps_link = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'phone', 'address', 'google_maps_link']

    def get_google_maps_link(self, obj):
        if obj.address:
            return f"https://www.google.com/maps/search/?api=1&query={obj.address.replace(' ', '+')}"
        return None



class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username','email', 'first_name', 'last_name', 'role', 'cin', 'inp', 'inpe','phone']


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        identifier = attrs.get("username")
        password = attrs.get("password")

        from users.models import CustomUser

        try:
            user = CustomUser.objects.get(
                cin=identifier
            )
        except CustomUser.DoesNotExist:
            try:
                user = CustomUser.objects.get(
                    inp=identifier
                )
            except CustomUser.DoesNotExist:
                try:
                    user = CustomUser.objects.get(
                        inpe=identifier
                    )
                except CustomUser.DoesNotExist:
                    raise Exception("Utilisateur non trouvé.")

        # Vérifier le mot de passe
        if not user.check_password(password):
            raise Exception("Mot de passe incorrect.")

        data = super().validate({"username": user.username, "password": password})
        return data
