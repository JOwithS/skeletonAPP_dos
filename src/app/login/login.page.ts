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
   /* this.checkActiveSession();*/

}

/*async checkActiveSession() {
  const isActive = await this.dbService.checkActiveSession();
  if (isActive) {
    this.navCtrl.navigateForward('/home');
  }
}*/


async login() {
  const isValidUser = await this.dbService.validateUser(this.username, this.password);
  if (isValidUser) {
    await this.dbService.updateSessionState(this.username, true);
    this.router.navigate(['/home']);
  } else {
    console.error('Invalid login');
  }
}

async register() {
  await this.dbService.registerSession(this.username, this.password);
  this.router.navigate(['/home']);
}





clickEvent(event: MouseEvent) {
  this.hide = !this.hide;
  event.stopPropagation();
}

submitForm() {
  console.log("Formulario enviado");
}

}
