import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefurbishmentOperationComponent } from './refurbishment-operation.component';

describe('RefurbishmentOperationComponent', () => {
  let component: RefurbishmentOperationComponent;
  let fixture: ComponentFixture<RefurbishmentOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefurbishmentOperationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefurbishmentOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
