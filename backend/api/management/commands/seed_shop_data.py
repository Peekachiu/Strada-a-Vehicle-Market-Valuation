from django.core.management.base import BaseCommand
from api.models import Category, Product


class Command(BaseCommand):
    help = 'Seed the database with e-commerce demo data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding e-commerce data...')

        # Clear existing data
        Product.objects.all().delete()
        Category.objects.all().delete()

        # Create categories
        categories_data = [
            {'name': 'Engine Oil', 'slug': 'engine-oil', 'icon': 'droplets', 'description': 'High-quality engine oils for all vehicle types', 'display_order': 1},
            {'name': 'Transmission Oil', 'slug': 'transmission-oil', 'icon': 'cog', 'description': 'Automatic and manual transmission fluids', 'display_order': 2},
            {'name': 'Oil Filters', 'slug': 'oil-filters', 'icon': 'filter', 'description': 'Oil filters for optimal engine performance', 'display_order': 3},
            {'name': 'Air Filters', 'slug': 'air-filters', 'icon': 'wind', 'description': 'Air intake filters for cleaner engine operation', 'display_order': 4},
            {'name': 'Brake Pads', 'slug': 'brake-pads', 'icon': 'disc', 'description': 'Premium brake pads for safe stopping', 'display_order': 5},
            {'name': 'Coolant', 'slug': 'coolant', 'icon': 'thermometer', 'description': 'Engine coolants and antifreeze', 'display_order': 6},
            {'name': 'Spark Plugs', 'slug': 'spark-plugs', 'icon': 'zap', 'description': 'Spark plugs for efficient ignition', 'display_order': 7},
            {'name': 'Car Care', 'slug': 'car-care', 'icon': 'sparkles', 'description': 'Car wash, wax, and detailing products', 'display_order': 8},
        ]

        categories = {}
        for cat_data in categories_data:
            cat = Category.objects.create(**cat_data)
            categories[cat_data['slug']] = cat
            self.stdout.write(f'  Created category: {cat.name}')

        # Create products
        products_data = [
            # Engine Oil
            {'category_slug': 'engine-oil', 'name': 'Shell Helix Ultra 5W-30', 'slug': 'shell-helix-ultra-5w30', 'brand': 'Shell', 'description': 'Fully synthetic motor oil with PurePlus Technology for ultimate engine protection.', 'price': 189.90, 'original_price': 219.90, 'stock': 50, 'is_active': True},
            {'category_slug': 'engine-oil', 'name': 'Castrol EDGE 0W-40', 'slug': 'castrol-edge-0w40', 'brand': 'Castrol', 'description': 'Full synthetic motor oil with Fluid TITANIUM for maximum performance.', 'price': 175.00, 'original_price': None, 'stock': 35, 'is_active': True},
            {'category_slug': 'engine-oil', 'name': 'Mobil 1 Extended Performance 10W-30', 'slug': 'mobil1-extended-10w30', 'brand': 'Mobil 1', 'description': 'Advanced full synthetic motor oil for longer engine life.', 'price': 159.90, 'original_price': 189.00, 'stock': 40, 'is_active': True},
            {'category_slug': 'engine-oil', 'name': 'Petronas Syntium 7000 0W-20', 'slug': 'petronas-syntium-7000-0w20', 'brand': 'Petronas', 'description': 'Premium synthetic engine oil with CoolTech technology.', 'price': 199.90, 'original_price': 229.90, 'stock': 25, 'is_active': True},
            {'category_slug': 'engine-oil', 'name': 'Toyota Genuine Motor Oil 5W-30', 'slug': 'toyota-genuine-5w30', 'brand': 'Toyota', 'description': 'OEM engine oil specifically formulated for Toyota vehicles.', 'price': 145.00, 'original_price': None, 'stock': 60, 'is_active': True},
            {'category_slug': 'engine-oil', 'name': 'Honda Genuine Motor Oil 0W-20', 'slug': 'honda-genuine-0w20', 'brand': 'Honda', 'description': 'OEM engine oil designed for Honda engines.', 'price': 139.90, 'original_price': None, 'stock': 45, 'is_active': True},

            # Transmission Oil
            {'category_slug': 'transmission-oil', 'name': 'Toyota ATF WS', 'slug': 'toyota-atf-ws', 'brand': 'Toyota', 'description': 'Genuine Toyota Automatic Transmission Fluid World Standard.', 'price': 95.00, 'original_price': None, 'stock': 30, 'is_active': True},
            {'category_slug': 'transmission-oil', 'name': 'Castrol Transmax CVT', 'slug': 'castrol-transmax-cvt', 'brand': 'Castrol', 'description': 'Premium CVT transmission fluid for smooth operation.', 'price': 110.00, 'original_price': 129.00, 'stock': 20, 'is_active': True},
            {'category_slug': 'transmission-oil', 'name': 'Shell Spirax S6 ATF', 'slug': 'shell-spirax-s6-atf', 'brand': 'Shell', 'description': 'High-performance automatic transmission fluid.', 'price': 85.00, 'original_price': None, 'stock': 35, 'is_active': True},
            {'category_slug': 'transmission-oil', 'name': 'Honda ATF DW-1', 'slug': 'honda-atf-dw1', 'brand': 'Honda', 'description': 'Genuine Honda automatic transmission fluid.', 'price': 99.90, 'original_price': None, 'stock': 25, 'is_active': True},

            # Oil Filters
            {'category_slug': 'oil-filters', 'name': 'Toyota Genuine Oil Filter', 'slug': 'toyota-oil-filter', 'brand': 'Toyota', 'description': 'OEM oil filter for Toyota vehicles. Ensures proper oil filtration.', 'price': 25.00, 'original_price': None, 'stock': 100, 'is_active': True},
            {'category_slug': 'oil-filters', 'name': 'Mann-Filter W67/1', 'slug': 'mann-filter-w67', 'brand': 'Mann', 'description': 'High-quality German oil filter for various Asian vehicles.', 'price': 18.90, 'original_price': None, 'stock': 80, 'is_active': True},
            {'category_slug': 'oil-filters', 'name': 'Bosch Oil Filter S3252', 'slug': 'bosch-oil-filter-s3252', 'brand': 'Bosch', 'description': 'Premium Bosch oil filter with superior filtration efficiency.', 'price': 22.50, 'original_price': 28.00, 'stock': 70, 'is_active': True},
            {'category_slug': 'oil-filters', 'name': 'Honda Genuine Oil Filter', 'slug': 'honda-oil-filter', 'brand': 'Honda', 'description': 'OEM oil filter designed for Honda engines.', 'price': 23.00, 'original_price': None, 'stock': 90, 'is_active': True},

            # Air Filters
            {'category_slug': 'air-filters', 'name': 'K&N High Performance Air Filter', 'slug': 'kn-high-performance-air-filter', 'brand': 'K&N', 'description': 'Washable and reusable high-flow air filter for increased horsepower.', 'price': 299.00, 'original_price': 349.00, 'stock': 15, 'is_active': True},
            {'category_slug': 'air-filters', 'name': 'Toyota Genuine Air Filter', 'slug': 'toyota-air-filter', 'brand': 'Toyota', 'description': 'OEM air filter for Toyota vehicles.', 'price': 45.00, 'original_price': None, 'stock': 60, 'is_active': True},
            {'category_slug': 'air-filters', 'name': 'Bosch Air Filter S0171', 'slug': 'bosch-air-filter-s0171', 'brand': 'Bosch', 'description': 'Premium air filter for optimal engine breathing.', 'price': 35.90, 'original_price': None, 'stock': 50, 'is_active': True},

            # Brake Pads
            {'category_slug': 'brake-pads', 'name': 'Brembo Front Brake Pads', 'slug': 'brembo-front-brake-pads', 'brand': 'Brembo', 'description': 'Premium brake pads for superior stopping power and low noise.', 'price': 289.00, 'original_price': 329.00, 'stock': 20, 'is_active': True},
            {'category_slug': 'brake-pads', 'name': 'Toyota Genuine Brake Pads (Front)', 'slug': 'toyota-brake-pads-front', 'brand': 'Toyota', 'description': 'OEM brake pads for reliable and consistent braking.', 'price': 179.00, 'original_price': None, 'stock': 30, 'is_active': True},
            {'category_slug': 'brake-pads', 'name': 'Bosch QuietCast Brake Pads', 'slug': 'bosch-quietcast-brake-pads', 'brand': 'Bosch', 'description': 'Low-noise ceramic brake pads for smooth, quiet stops.', 'price': 199.00, 'original_price': 239.00, 'stock': 25, 'is_active': True},
            {'category_slug': 'brake-pads', 'name': 'Honda Genuine Brake Pads (Rear)', 'slug': 'honda-brake-pads-rear', 'brand': 'Honda', 'description': 'OEM rear brake pads for Honda vehicles.', 'price': 155.00, 'original_price': None, 'stock': 35, 'is_active': True},

            # Coolant
            {'category_slug': 'coolant', 'name': 'Toyota Super Long Life Coolant', 'slug': 'toyota-super-long-life-coolant', 'brand': 'Toyota', 'description': 'Pre-diluted genuine Toyota coolant (pink). Protects to -37°C.', 'price': 69.90, 'original_price': None, 'stock': 40, 'is_active': True},
            {'category_slug': 'coolant', 'name': 'Shell Premium Coolant', 'slug': 'shell-premium-coolant', 'brand': 'Shell', 'description': 'Universal coolant compatible with all vehicle types.', 'price': 49.90, 'original_price': 59.90, 'stock': 55, 'is_active': True},
            {'category_slug': 'coolant', 'name': 'Prestone Extended Life Coolant', 'slug': 'prestone-extended-life-coolant', 'brand': 'Prestone', 'description': '10-year extended life antifreeze/coolant.', 'price': 55.00, 'original_price': None, 'stock': 45, 'is_active': True},

            # Spark Plugs
            {'category_slug': 'spark-plugs', 'name': 'NGK Iridium IX Spark Plug', 'slug': 'ngk-iridium-ix-spark-plug', 'brand': 'NGK', 'description': 'Premium iridium spark plug for improved ignition and fuel efficiency.', 'price': 45.00, 'original_price': None, 'stock': 80, 'is_active': True},
            {'category_slug': 'spark-plugs', 'name': 'Denso Platinum TT Spark Plug', 'slug': 'denso-platinum-tt-spark-plug', 'brand': 'Denso', 'description': 'Double platinum spark plug for long-lasting performance.', 'price': 35.00, 'original_price': 42.00, 'stock': 70, 'is_active': True},
            {'category_slug': 'spark-plugs', 'name': 'Bosch Double Platinum Spark Plug', 'slug': 'bosch-double-platinum-spark-plug', 'brand': 'Bosch', 'description': 'Double platinum spark plug for consistent ignition performance.', 'price': 38.90, 'original_price': None, 'stock': 60, 'is_active': True},

            # Car Care
            {'category_slug': 'car-care', 'name': 'Meguiar\'s Ultimate Wash & Wax', 'slug': 'meguiars-ultimate-wash-wax', 'brand': 'Meguiar\'s', 'description': 'Premium car wash with synthetic wax for brilliant shine.', 'price': 59.90, 'original_price': 69.90, 'stock': 40, 'is_active': True},
            {'category_slug': 'car-care', 'name': 'Turtle Wax Ice Spray Wax', 'slug': 'turtle-wax-ice-spray-wax', 'brand': 'Turtle Wax', 'description': 'Quick and easy spray wax for a glossy finish.', 'price': 39.90, 'original_price': None, 'stock': 50, 'is_active': True},
            {'category_slug': 'car-care', 'name': 'Armor All Complete Car Care Kit', 'slug': 'armor-all-complete-car-care-kit', 'brand': 'Armor All', 'description': 'Complete kit including wash, wax, tire shine, and interior cleaner.', 'price': 89.90, 'original_price': 109.00, 'stock': 20, 'is_active': True},
            {'category_slug': 'car-care', 'name': 'Sonax Profiline Brilliant Shine Detailer', 'slug': 'sonax-brilliant-shine-detailer', 'brand': 'Sonax', 'description': 'Professional-grade quick detailer for showroom finish.', 'price': 75.00, 'original_price': None, 'stock': 30, 'is_active': True},
        ]

        for prod_data in products_data:
            category_slug = prod_data.pop('category_slug')
            prod_data['category'] = categories[category_slug]
            Product.objects.create(**prod_data)

        self.stdout.write(self.style.SUCCESS(f'\nSuccessfully seeded {len(categories)} categories and {len(products_data)} products!'))
