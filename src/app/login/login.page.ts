import { Component, OnInit } from '@angular/core';
import { ServicioDBService } from '../services/servicio-db.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  hide = true;

  username: string = "";
  password: string = "";

  constructor(private dbService: ServicioDBService, private navCtrl: NavController, private router: Router) {}

  ngOnInit() {
    this.checkActiveSession();
  }

  ionViewWillEnter() {
    this.resetForm(); 
  }

  async checkActiveSession() {
    try {
      const isActive = await this.dbService.checkActiveSession();
      if (isActive) {
        this.navCtrl.navigateForward('/home');
      }
    } catch (error) {
      console.error('Error al verificar la sesión activa', error);
    }
  }

  async login() {
    try {
      const isValid = await this.dbService.validateUser(this.username, this.password);
      if (isValid) {
        // Actualizar el estado de la sesión en SQLite e Ionic Storage
        await this.dbService.updateSessionState(this.username, true);
        await this.dbService.login('dummy_token'); // Guardar un token de autenticación
        // Redirigir a la página home o cualquier otra página protegida
        this.router.navigate(['/home']);
      } else {
        console.error('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error en el login', error);
    }
   }
 

   async register() {
    try {
      await this.dbService.registerSession(this.username, this.password);
      // Actualizar el estado de la sesión en SQLite e Ionic Storage
      await this.dbService.updateSessionState(this.username, true);
      await this.dbService.login('dummy_token'); // Guardar un token de autenticación
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error durante el registro', error);
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  resetForm() {
    this.username = "";
    this.password = "";
  }

  submitForm() {
    console.log("Formulario enviado");
  }
}
