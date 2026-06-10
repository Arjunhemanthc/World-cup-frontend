import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminPollsComponent } from './admin-polls';

describe('AdminPollsComponent', () => {
  let component: AdminPollsComponent;
  let fixture: ComponentFixture<AdminPollsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPollsComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminPollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
