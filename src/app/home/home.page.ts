import { Component } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  nombre: string = "Peru";
  selectedSegment: string = 'exp-laboral';

  constructor(private router: Router) { }

  ngOnInit() { }
  
  submitForm() {
    console.log("Formulario enviado");
    this.router.navigate(['/otro', { nombre: this.nombre }]);
  }


  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
}

guardarDatos(){
  
}
}