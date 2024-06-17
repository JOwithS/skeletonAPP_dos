import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [authGuard] 
  },
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },

  {
    path: 'mis-datos', loadChildren: () => import('./mis-datos/mis-datos.module').then( m => m.MisDatosPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'otro', loadChildren: () => import('./otro/otro.module').then( m => m.OtroPageModule)
  },

  {
    path: 'page-not-found',
    loadChildren: () => import('./page-not-found/page-not-found.module').then( m => m.PageNotFoundPageModule)
  },

  {// Captura todas las rutas no definidas
    path: '**', 
    redirectTo: '/page-not-found'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
