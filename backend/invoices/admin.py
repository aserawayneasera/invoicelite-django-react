from django.contrib import admin
from .models import Invoice, InvoiceItem, Quote, QuoteItem, Payment

class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 0

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'client', 'status', 'issue_date']
    list_filter = ['status']
    inlines = [InvoiceItemInline]

admin.site.register(Quote)
admin.site.register(Payment)