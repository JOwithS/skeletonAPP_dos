import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioDBService } from '../services/servicio-db.service';


@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.page.html',
  styleUrls: ['./mis-datos.page.scss'],
})
export class MisDatosPage implements OnInit {

  username?: string;
  nombre: string = "Peru";
  selectedSegment: string = 'exp-laboral';

  constructor(private dbService: ServicioDBService, private router: Router) {}

  async ngOnInit() {
    const isActiveSession = await this.dbService.checkActiveSession();
    if (!isActiveSession) {
      this.router.navigate(['/login']);
    } else {
      const currentUser = await this.dbService.getCurrentUser();
      if (currentUser === null) {
        this.router.navigate(['/login']);
      } else {
        this.username = currentUser;
      }
    }
  }

  submitForm() {
    console.log("Formulario enviado");
    this.router.navigate(['/otro', { nombre: this.nombre }]);
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  async logout() {
    if (this.username) {
      await this.dbService.updateSessionState(this.username, false);
    }
    this.router.navigate(['/login']);
  }
}

