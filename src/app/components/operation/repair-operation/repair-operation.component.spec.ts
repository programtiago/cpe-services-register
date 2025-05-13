import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairOperationComponent } from './repair-operation.component';

describe('RepairOperationComponent', () => {
  let component: RepairOperationComponent;
  let fixture: ComponentFixture<RepairOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RepairOperationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepairOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
