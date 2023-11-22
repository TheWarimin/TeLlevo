import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { ServiciosService } from '../servicios/servicios.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  constructor(private modalController: ModalController, private router: Router, private activatedRouter: ActivatedRoute, private auth: ServiciosService, private authGuard: AuthGuard) { }

  showFiller = false;
  user={
    usuario:"",
    password:""
    };

    newUsername: string = '';
    newPassword: string = '';
    newRole: 'pasajero' | 'dueno' = 'pasajero';

    async guardarCambios() {
      try {
        const currentUsername = this.auth.getCurrentUsername();
        if (currentUsername !== undefined) {
          const success = await this.auth.changeUserProfile(this.newUsername, this.newPassword, this.newRole);
          if (success) {
            console.log('Cambios guardados con éxito');
          } else {
            console.log('Error al guardar cambios');
          }
        } else {
          console.log(currentUsername);
          console.log('Nombre de usuario actual no encontrado');
        }
      } catch (error) {
        console.error('Error inesperado:', error);
      }
    }
    

    goTologin(){
      this.router.navigate(['/login'], { state: { user: this.user } });
    }

    goTomapa(){
      this.router.navigate(['/mapa'], { state: { user: this.user } });
    }

    goToviaje(){
      this.router.navigate(['/viaje'], { state: { user: this.user } });
    }
    
    goToperfil(){
      this.router.navigate(['/perfil'], { state: { user: this.user } });
    }

    cerrar() {
      this.auth.logout()
    }  

    ngOnInit() {
      this.activatedRouter.queryParams.subscribe(() => {
        let state = this.router.getCurrentNavigation()?.extras.state;
        if (state) {
          this.user.usuario = state['user'].usuario;
          this.user.password = state['user'].password;
          console.log(this.user);
          }
        })
    }

}
