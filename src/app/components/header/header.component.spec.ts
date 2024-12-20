import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CartService } from '../../services/cart.service';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;
  let cartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLogged', 'removeToken']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['fetchUserProfile']);
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['toggleCartVisibility']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HeaderComponent], 
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: CartService, useValue: cartServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;

    userService.fetchUserProfile.and.returnValue(of({
        _id:'1',
      firstname: 'John',
      lastname: 'Doe',
      avatar: 'avatar.png',
      email: 'john.doe@example.com',
      password: 'password123'
    }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchUserProfile if user is logged in', () => {
    authService.isLogged.and.returnValue(true);
    component.ngOnInit();
    expect(userService.fetchUserProfile).toHaveBeenCalled();
  });

  it('should toggle menu visibility', () => {
    component.menuVisible = false;
    component.toggleMenu();
    expect(component.menuVisible).toBeTrue();
  });

  it('should call authService.removeToken on logout', () => {
    component.logout();
    expect(authService.removeToken).toHaveBeenCalled();
  });

  it('should call cartService.toggleCartVisibility on handleCartClick', () => {
    component.handleCartClick();
    expect(cartService.toggleCartVisibility).toHaveBeenCalled();
  });
});
