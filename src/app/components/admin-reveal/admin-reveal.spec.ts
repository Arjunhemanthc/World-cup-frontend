import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminRevealComponent } from './admin-reveal';

describe('AdminRevealComponent', () => {
  let component: AdminRevealComponent;
  let fixture: ComponentFixture<AdminRevealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRevealComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminRevealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
