from django.db import models
from users.models import User
class Document(models.Model):
    document_id = models.AutoField(primary_key=True, help_text="Stores the document's unique identifier")
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, help_text="Stores the user’s unique identifier")
    type = models.TextField(max_length=50, help_text="Stores the document type, credit report, or loan agreement")
    file_url = models.ImageField(upload_to='documents/', help_text="Stores the URL of the file")
    uploaded_at = models.DateTimeField(auto_now_add=True, help_text="Stores the time the document was uploaded")
    def __str__(self):
        return f"Document {self.document_id} - {self.type}"