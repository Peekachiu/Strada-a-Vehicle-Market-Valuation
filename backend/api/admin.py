from django.contrib import admin
from .models import Profile, Valuation, Vehicle, PasswordResetOTP
from .models import Category, Product, Cart, CartItem, Order, OrderItem

# Register your models here.
admin.site.register(Profile)
admin.site.register(Valuation)
admin.site.register(Vehicle)
admin.site.register(PasswordResetOTP)


# ========================================
# E-COMMERCE ADMIN REGISTRATIONS
# ========================================

class ProductInline(admin.TabularInline):
    model = Product
    extra = 0
    show_change_link = True


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon', 'display_order', 'product_count')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('display_order', 'name')

    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Products'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'category', 'price', 'original_price', 'stock', 'is_active', 'discount_percentage')
    list_filter = ('category', 'brand', 'is_active')
    search_fields = ('name', 'brand', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('price', 'stock', 'is_active')
    actions = ['activate_products', 'deactivate_products']

    def discount_percentage(self, obj):
        return f"{obj.discount_percentage}%" if obj.discount_percentage else "-"
    discount_percentage.short_description = 'Discount'

    def activate_products(self, request, queryset):
        queryset.update(is_active=True)
    activate_products.short_description = "Activate selected products"

    def deactivate_products(self, request, queryset):
        queryset.update(is_active=False)
    deactivate_products.short_description = "Deactivate selected products"


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'subtotal')


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'user', 'item_count', 'total_price', 'created_at')
    inlines = [CartItemInline]
    readonly_fields = ('user', 'created_at')


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'price', 'subtotal')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'user', 'status', 'total_price', 'created_at', 'updated_at')
    list_filter = ('status',)
    list_editable = ('status',)
    inlines = [OrderItemInline]
    readonly_fields = ('user', 'total_price', 'created_at', 'updated_at')
    actions = ['mark_processing', 'mark_shipped', 'mark_delivered']

    def mark_processing(self, request, queryset):
        queryset.update(status='processing')
    mark_processing.short_description = "Mark selected as Processing"

    def mark_shipped(self, request, queryset):
        queryset.update(status='shipped')
    mark_shipped.short_description = "Mark selected as Shipped"

    def mark_delivered(self, request, queryset):
        queryset.update(status='delivered')
    mark_delivered.short_description = "Mark selected as Delivered"