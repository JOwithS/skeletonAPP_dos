import { TestBed } from '@angular/core/testing';

import { ServicioDBService } from './servicio-db.service';

describe('ServicioDBService', () => {
  let service: ServicioDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
