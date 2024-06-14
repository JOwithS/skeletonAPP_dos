import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.page.html',
  styleUrls: ['./mis-datos.page.scss'],
})
export class MisDatosPage implements OnInit {

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

