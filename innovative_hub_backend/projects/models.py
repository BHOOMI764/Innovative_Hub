from django.db import models
from django.contrib.auth.models import User
import json

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    authors = models.ManyToManyField(User, related_name='projects')
    thumbnail = models.URLField()
    sdgs = models.TextField()  # Will store JSON string
    rating = models.FloatField(default=0.0)
    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    github_url = models.URLField()
    demo_url = models.URLField(blank=True, null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    upvotes = models.ManyToManyField(User, related_name='upvoted_projects', blank=True)
    downvotes = models.ManyToManyField(User, related_name='downvoted_projects', blank=True)

    def set_sdgs(self, sdgs_list):
        self.sdgs = json.dumps(sdgs_list)

    def get_sdgs(self):
        return json.loads(self.sdgs) if self.sdgs else []

    def __str__(self):
        return self.title

class Testimonial(models.Model):
    quote = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=100)
    avatar = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Testimonial by {self.author.username}"

class LeaderboardEntry(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    team = models.CharField(max_length=100)
    score = models.IntegerField()
    badge = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project.title} - {self.team}"

class ProjectRating(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('project', 'user')

    def __str__(self):
        return f"{self.project.title} - {self.user.username} - {self.rating}"

class Comment(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Comment by {self.user.username} on {self.project.title}' 