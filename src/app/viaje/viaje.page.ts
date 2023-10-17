import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { ServiciosService } from '../servicios/servicios.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.page.html',
  styleUrls: ['./viaje.page.scss'],
})
export class ViajePage implements OnInit {

  direccion: string = '';
  horaSalida: string = '';
  precioPorPersona: number = 0;
  viajes: any[] = [];;


  constructor(private modalController: ModalController, private router: Router, private activatedRouter: ActivatedRoute, private auth: ServiciosService, private authGuard: AuthGuard) { }

  showFiller = false;
  user={
    usuario:"",
    password:""
    };

    agregarViaje() {
      if (this.direccion && this.horaSalida && this.precioPorPersona > 0) {
        this.auth.addTrip(this.direccion, this.horaSalida, this.precioPorPersona);
        this.direccion = '';
        this.horaSalida = '';
        this.precioPorPersona = 0;
        this.actualizarListaViajes();
      } else {
        console.log("Por favor, complete todos los campos y asegúrese de que el precio sea mayor que 0.");
      }
    }
  
    eliminarViajesMarcados() {
      const viajesMarcados = this.viajes.filter((viaje) => viaje.seleccionado);
      if (viajesMarcados.length > 0) {
        viajesMarcados.forEach((viaje) => {
          this.auth.deleteTripById(viaje.id);
        });
      }}

    actualizarListaViajes() {
      this.viajes = this.auth.getViajes();
    }
  
    ionViewWillEnter() {
      this.actualizarListaViajes();
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