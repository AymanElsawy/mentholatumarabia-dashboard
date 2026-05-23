import { SingleBlogComponent } from './sidebar pages/single-blog/single-blog.component';
import { SingleCountryComponent } from './sidebar pages/single-country/single-country.component';
import { Routes } from '@angular/router';
import { BrandsComponent } from './sidebar pages/brands/brands.component';
import { CountriesComponent } from './sidebar pages/countries/countries.component';
import { ProductsComponent } from './sidebar pages/products/products.component';
import { BlogsComponent } from './sidebar pages/blogs/blogs.component';
import { ContactComponent } from './sidebar pages/contact/contact.component';
import { SingleBrandComponent } from './sidebar pages/single-brand/single-brand.component';
import { SingleProductComponent } from './sidebar pages/single-product/single-product.component';
import { FaqComponent } from './sidebar pages/faq/faq.component';
import { SingleProductFAQComponent } from './sidebar pages/single-product-faq/single-product-faq.component';
import { UsersComponent } from './sidebar pages/users/users.component';
import { SingleUserComponent } from './sidebar pages/single-user/single-user.component';

export default [
    { path: '', redirectTo: 'brands', pathMatch: 'full' },
    { path: 'brands', component: BrandsComponent, title: 'Brands | Mentholatum' },
    { path: 'brands/:id', component: SingleBrandComponent, title: 'Brand | Mentholatum' },
    { path: 'countries', component: CountriesComponent, title: 'Countries | Mentholatum' },
    { path: 'countries/:id', component: SingleCountryComponent, title: 'Country | Mentholatum' },

    { path: 'products', component: ProductsComponent, title: 'Products | Mentholatum' },
    { path: 'products/:id', component: SingleProductComponent, title: 'Product | Mentholatum' },
    { path: 'faq', component: FaqComponent, title: 'FAQ | Mentholatum' },
    { path: 'productFAQ/:id', component: SingleProductFAQComponent, title: 'FAQ | Mentholatum' },

    { path: 'blogs', component: BlogsComponent, title: 'Blogs | Mentholatum' },
    { path: 'blogs/:id', component: SingleBlogComponent, title: 'Blog | Mentholatum' },
    { path: 'admins', component: UsersComponent, title: 'Admins | Mentholatum' },
    { path: 'admins/:id', component: SingleUserComponent, title: 'Admin | Mentholatum' },

    { path: 'contact', component: ContactComponent, title: 'Contact | Mentholatum' },

    { path: '**', redirectTo: '/notfound' }
] as Routes;
