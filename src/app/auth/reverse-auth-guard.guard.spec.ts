import { TestBed } from '@angular/core/testing';

import { ReverseAuthGuardGuard } from './reverse-auth-guard.guard';

describe('ReverseAuthGuardGuard', () => {
  let guard: ReverseAuthGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ReverseAuthGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
