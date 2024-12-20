import { Routes } from '@angular/router';
import { redirectIfLogged } from './guards/redirectIfLogged.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PrivateExampleComponent } from './pages/private-example/private-example.component';
import { HomeComponent } from './pages/home/home.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ThanksComponent } from './pages/thanks/thanks.component';
import { ProductComponent } from './pages/producto/producto.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { isLoggedGuard } from './guards/is-logged.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [redirectIfLogged] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [redirectIfLogged],
  },
  {
    path: 'ruta-privada',
    component: PrivateExampleComponent,
    canActivate: [isLoggedGuard],
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [isLoggedGuard],
  },
  { path: 'thanks', component: ThanksComponent },
  { path: 'products/:id', component: ProductComponent },
  { path: 'contact', component: ContactComponent }, // Added Contact Us route
  { path: 'about', component: AboutComponent }, // Added About Us route
];
