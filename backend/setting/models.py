from django.db import models

class IDCardProfile(models.Model):
    image = models.ImageField(upload_to='id_cards/')
    is_active = models.BooleanField(default=True, help_text="Check to display this image on the 3D ID card")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ID Card Image ({'Active' if self.is_active else 'Inactive'})"

    def save(self, *args, **kwargs):
        if self.is_active:
            # Set all other profiles to inactive
            IDCardProfile.objects.filter(is_active=True).update(is_active=False)
        super().save(*args, **kwargs)
