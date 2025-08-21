from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator, EmailValidator
from django.db import models, IntegrityError
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
import re

USER_TYPE_CHOICES = [
    ('farmer', 'Farmer'),
    ('cooperative', 'Cooperative'),
]

class UserManager(BaseUserManager):
    def create_user(self, national_id=None, fullname=None, email=None, phone_number=None,
                    cooperative_id=None, password=None, **extra_fields):
        user_type = extra_fields.get('type')

        national_id = national_id or None
        cooperative_id = cooperative_id or None

        if user_type == 'farmer' and not national_id:
            raise ValueError('National ID must be set for farmers')

        if user_type == 'cooperative' and not cooperative_id:
            raise ValueError('Cooperative ID must be set for cooperatives')

        if not fullname:
            raise ValueError('Full name must be set')

        if not email:
            raise ValueError('Email must be set')

        attempt = 0
        max_attempts = 5

        while attempt < max_attempts:
            try:
                if user_type == 'farmer':
                    existing_ids = User.objects.filter(type='farmer') \
                                   .exclude(cooperative_id__isnull=True) \
                                   .values_list('cooperative_id', flat=True)
                    existing_numbers = set()
                    for cid in existing_ids:
                        try:
                            existing_numbers.add(int(cid))
                        except (ValueError, TypeError):
                            pass

                    new_id = 1
                    while new_id in existing_numbers:
                        new_id += 1
                    cooperative_id = str(new_id)

                user = self.model(
                    national_id=national_id,
                    fullname=fullname,
                    email=email,
                    phone_number=phone_number,
                    cooperative_id=cooperative_id,
                    **extra_fields,
                )
                user.set_password(password)
                user.full_clean()
                user.save(using=self._db)
                return user
            except IntegrityError as e:
           
                if 'cooperative_id' in str(e):
                    attempt += 1
                    continue
                else:
                    raise e
        raise IntegrityError("Could not create user with unique cooperative_id after multiple attempts")

    def create_superuser(self, national_id=None, fullname=None, email=None, phone_number=None,
                         password=None, cooperative_id=None, **extra_fields):
     
        extra_fields.setdefault('type', 'cooperative')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        national_id = national_id or None

  
        if extra_fields['type'] == 'cooperative' and not cooperative_id:
            cooperative_id = 'COOP-0000-0000'

        if extra_fields['type'] == 'farmer' and not national_id:
            raise ValueError('Superuser farmer must have a national ID')

        if extra_fields['type'] == 'cooperative' and not cooperative_id:
            raise ValueError('Superuser cooperative must have a cooperative ID')

        if not fullname:
            raise ValueError('Full name must be set')

        if not email:
            raise ValueError('Email must be set')

        return self.create_user(national_id, fullname, email, phone_number, cooperative_id, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    fullname = models.CharField(
        max_length=70,
        validators=[RegexValidator(regex=r'^[A-Za-z ]+$', message='Full name must contain only letters and spaces')]
    )
    email = models.EmailField(
        unique=True,
        max_length=255,
        default='default@example.com',
        validators=[EmailValidator(message='Enter a valid email address')]
    )
    phone_number = models.CharField(
        max_length=10,
        unique=True,
        null=True,
        blank=True,
        validators=[RegexValidator(regex=r'^07\d{8}$', message='Phone number must be 10 digits starting with 07')]
    )
    type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    national_id = models.CharField(
        max_length=50,
        unique=True,
        null=True,
        blank=True,
        help_text="Required for farmers only!",
        validators=[RegexValidator(regex=r'^\d{7}$', message='National ID must be 7 digits')]
    )
    cooperative_id = models.CharField(
        max_length=50,
        unique=True,
        null=True,
        blank=True,
        help_text="Required for cooperatives only!"
    )


    is_staff = models.BooleanField(
        default=False,
        help_text='Designates whether the user can log into this admin site.'
    )
    is_superuser = models.BooleanField(
        default=False,
        help_text='Designates that this user has all permissions without explicitly assigning them.'
    )
    is_active = models.BooleanField(
        default=True,
        help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
  
    REQUIRED_FIELDS = ['fullname']

    objects = UserManager()

    def clean(self):
        super().clean()

        if self.national_id == '':
            self.national_id = None
        if self.cooperative_id == '':
            self.cooperative_id = None

        if self.type == 'farmer':
            if not self.national_id:
                raise ValidationError({'national_id': "National ID is required for farmers."})

        elif self.type == 'cooperative':
            if not self.cooperative_id:
                raise ValidationError({'cooperative_id': "Cooperative ID is required for cooperatives."})

            pattern = r'^COOP-\d{4}-\d{4}$'
            if not re.match(pattern, self.cooperative_id or ''):
                raise ValidationError({'cooperative_id': "Cooperative ID must be in format COOP-XXXX-XXXX"})

        if self.national_id:
            qs = User.objects.filter(national_id=self.national_id).exclude(pk=self.pk)
            if qs.exists():
                raise ValidationError({'national_id': "This National ID is already registered."})

        if self.cooperative_id:
            qs = User.objects.filter(cooperative_id=self.cooperative_id).exclude(pk=self.pk)
            if qs.exists():
                raise ValidationError({'cooperative_id': "This Cooperative ID is already registered."})

    def __str__(self):
        return f"{self.fullname} ({self.get_type_display()})"

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
