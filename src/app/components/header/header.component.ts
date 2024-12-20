import { Component, OnInit, ViewChild, ElementRef, inject, HostListener } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { CurrencyPipe } from '@angular/common';
import { CartProductComponent } from '../cart-product/cart-product.component';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, CurrencyPipe, CartProductComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  cart = this.cartService.products;
  menuVisible = false;
  userProfile: User | null = null;

  @ViewChild('dropdownContent', { static: false }) dropdownContent!: ElementRef;
  @ViewChild('userMenu', { static: false }) userMenu!: ElementRef;

  ngOnInit(): void {
    this.fetchUserProfile();
    this.setupNavMenu();
  }

  private setupNavMenu() {
    const nav = document.querySelector('#nav');
    const open = document.querySelector('#open');
    const close = document.querySelector('#close');
    const overlay = document.querySelector('#overlay');

    open?.addEventListener('click', () => {
      this.toggleNavMenu(nav, overlay, true);
    });

    close?.addEventListener('click', () => {
      this.toggleNavMenu(nav, overlay, false);
    });

    overlay?.addEventListener('click', () => {
      this.toggleNavMenu(nav, overlay, false);
    });
  }

  private toggleNavMenu(nav: Element | null, overlay: Element | null, open: boolean) {
    if (open) {
      nav?.classList.add('visible');
      overlay?.classList.add('active');
      document.querySelector('.nav-hamburguer')?.classList.add('menu-open');
    } else {
      nav?.classList.remove('visible');
      overlay?.classList.remove('active');
      document.querySelector('.nav-hamburguer')?.classList.remove('menu-open');
    }
  }

  fetchUserProfile() {
    if (this.authService.isLogged()) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.userService.fetchUserProfile(userId).subscribe({
          next: (profile) => {
            this.userProfile = profile;
          },
          error: (error) => {
            console.error('Error fetching user profile:', error.message || error);
          }
        });
      }
    }
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
    console.log('Menú visible:', this.menuVisible);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.dropdownContent || !this.userMenu) {
      return;
    }

    const isDropdownClicked = this.dropdownContent.nativeElement.contains(event.target);
    const isUserProfileClicked = this.userMenu.nativeElement.contains(event.target);

    if (!isDropdownClicked && !isUserProfileClicked) {
      this.menuVisible = false;
    }
  }

  isLogged() {
    return this.authService.isLogged();
  }

  logout() {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }

  handleCartClick(): void {
    this.cartService.toggleCartVisibility();
  }
}
