import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ExperienciaLaboralComponent } from '../experiencia-laboral/experiencia-laboral.component';
import { CertificacionesComponent } from '../certificaciones/certificaciones.component';

@NgModule({
  declarations: [
    ExperienciaLaboralComponent,
    CertificacionesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    ExperienciaLaboralComponent,
    CertificacionesComponent,
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class SharedModule { }