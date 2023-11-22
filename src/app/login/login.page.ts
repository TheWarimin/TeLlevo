import { Component, OnInit } from '@angular/core';
import { Router , NavigationExtras } from '@angular/router';
import { AnimationController, Animation  } from '@ionic/angular';
import { ServiciosService } from '../servicios/servicios.service';
import { AuthGuard } from '../guards/auth.guard';

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
  constructor(private router: Router, private animationCtrl: AnimationController, private auth: ServiciosService, private authGuard: AuthGuard) {}

  public alerta = "";
  public model_alerta = "";

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
      this.alerta = "Ingrese sus datos correctamente";
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
          this.router.navigate(['/mapa'], navigationExtras);
        } else {
          this.alerta = "Credenciales incorrectas";
        }
      })
      .catch(error => {
        console.error("Error durante la autenticación:", error);
        this.alerta = "Ocurrió un error durante la autenticación";
      });
  }
  
  

  validacion(): boolean {
    if (this.user.usuario === "" || this.user.password === "") {
      this.alerta = "Por favor, complete ambos campos";
      return false;
    }
    const currentRole = this.auth.getCurrentRole();
    if (currentRole === null) {
      this.alerta = "Por favor, seleccione un rol despues de registrarse.";
      return true;
    }
    this.alerta = "Registro exitoso";
    this.auth.register(this.user.usuario, this.user.password, currentRole);
    return true;
  }

  async changePassword() {
    const username = this.user.usuario;
    const newPassword = this.newPassword;
    if (username && newPassword) {
      const success = await this.auth.changePassword(username, newPassword);
      if (success) {
        this.model_alerta="Contraseña cambiada con exito";
      } else {
        this.model_alerta="Error cambiando contraseña";
      }
    } else {
      this.model_alerta="Ingrese tanto usuario como nueva contraseña";
    }
  }
  

  ngOnInit() {}
}
