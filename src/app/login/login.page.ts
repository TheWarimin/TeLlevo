import { Component, OnInit } from '@angular/core';
import { Router , NavigationExtras } from '@angular/router';
import { AnimationController, Animation  } from '@ionic/angular';
import { ServiciosService } from '../servicios/servicios.service';
import { AuthGuard } from '../guards/auth.guard';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  hide = true;
  user = {
    usuario: "",
    password: ""
  };

  newPassword: string = '';
  newRole: 'pasajero' | 'dueno' | null = null;

  constructor(private toastController: ToastController, private router: Router, private animationCtrl: AnimationController, private auth: ServiciosService, private authGuard: AuthGuard) {}

  async mostrarMensaje(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000, 
      color: color,
      position: 'top' 
    });
    toast.present();
  }

  async girarElemento() {
    const elemento = document.querySelector('.contenedor');

    if (elemento !== null) {
      const animation: Animation = this.animationCtrl.create()
        .addElement(elemento)
        .duration(1000)
        .easing('ease-in-out')
        .fromTo('transform', 'rotate(0deg)', 'rotate(360deg)');

      await animation.play();
    } else {
      console.error("El elemento '.contenedor' no se encontró en el DOM.");
    }
  }

  async goTomapa() {
    if (this.validacion()) {
      const loginPageElement = document.querySelector('.contenedor') as HTMLElement;
      
      if (loginPageElement) {
        const enterAnimation = this.animationCtrl.create()
          .addElement(loginPageElement)
          .duration(600)
          .fromTo('opacity', '1', '0');

        await enterAnimation.play();
        this.router.navigate(['/mapa'], { state: { user: this.user } });
        loginPageElement.style.opacity = '0'; 
      } else {
        console.error("No se encontró ningún elemento con la clase '.contenedor'");
      }
    }
  }

  enviar() {
    const { usuario, password } = this.user;
    if (!usuario || !password) {
      this.mostrarMensaje ("Ingrese sus datos correctamente","danger");
      return;
    }
    this.auth.login(usuario, password)
      .then(() => {
        if (this.auth.validado) {
          this.auth.setCurrentUsername(usuario);
          const currentUsername = this.auth.getCurrentUsername();
          const navigationExtras: NavigationExtras = {
            state: { user: { usuario: currentUsername } }
          };
          console.log("Nuevo rol al registrarse:", this.newRole);
          this.router.navigate(['/mapa'], navigationExtras);
        } else {
          console.log(usuario, password);
          this.mostrarMensaje("Credenciales incorrectas","danger");
        }
      })
      .catch(error => {
        console.error("Error durante la autenticación:","danger", error);
        this.mostrarMensaje("Ocurrió un error durante la autenticación","danger");
      });
  }


  validacion(): boolean {
    if (this.user.usuario === "" || this.user.password === "") {
      this.mostrarMensaje ("Por favor, complete ambos campos","danger");
      return false;
    }

    if (this.newRole === null) {
      this.mostrarMensaje("Seleccione un rol antes de registrarse","danger");
      return false;
    }

    this.mostrarMensaje ("Registro exitoso");
    this.auth.register(this.user.usuario, this.user.password, this.newRole);
    return true;
  }

  async changePassword() {
    const username = this.user.usuario;
    const newPassword = this.newPassword;
    if (username && newPassword) {
      const success = await this.auth.changePassword(username, newPassword);
      if (success) {
        this.mostrarMensaje("Contraseña cambiada con exito");
      } else {
        this.mostrarMensaje("Error cambiando contraseña","danger");
      }
    } else {
      this.mostrarMensaje("Ingrese tanto usuario como nueva contraseña","danger");
    }
  }
  

  ngOnInit() {}
}
