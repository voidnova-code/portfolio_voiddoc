from django.contrib import admin
from .models import IDCardProfile

@admin.register(IDCardProfile)
class IDCardProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'image', 'is_active', 'created_at')
    list_filter = ('is_active',)
