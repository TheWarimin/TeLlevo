import { Component, OnInit } from '@angular/core';
import { Router , NavigationExtras } from '@angular/router';
import { AnimationController } from '@ionic/angular';

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

  constructor(private router: Router, private animationCtrl: AnimationController) {}

  public mensaje = ""

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
    if (this.user.usuario != "") {
      let navigationExtras: NavigationExtras = {
        state: { user: this.user }
      }
      this.router.navigate(['/mapa'], navigationExtras);
    } else {
      this.mensaje = "ingrese sus datos";
    }
  }

  validacion(): boolean {
    if (this.user.usuario.length < 6) {
      alert("El usuario debe tener al menos 6 caracteres.");
      return false;
    }
    if (this.user.usuario === "" || this.user.password === "") {
      alert("Por favor, complete ambos campos.");
      return false;
    }
    return true;
  }

  ngOnInit() {}
}
