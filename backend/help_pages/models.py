from django.db import models
from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel


class HelpIndexPage(Page):
    intro = models.TextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('intro'),
    ]

    def get_context(self, request):
        context = super().get_context(request)
        context['articles'] = HelpArticlePage.objects.live().child_of(self)
        return context


class HelpArticlePage(Page):
    body = RichTextField()
    category = models.CharField(max_length=100, blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('category'),
        FieldPanel('body'),
    ]