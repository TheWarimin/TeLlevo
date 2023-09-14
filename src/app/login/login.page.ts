import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  async goTomapa() {
    if (this.validacion()) {
      const loginPageElement = document.querySelector('.contenedor') as HTMLElement;
      
      if (loginPageElement) {
        const enterAnimation = this.animationCtrl.create()
          .addElement(loginPageElement)
          .duration(1000)
          .fromTo('opacity', '1', '0');

        await enterAnimation.play();
        this.router.navigate(['/mapa'], { state: { user: this.user } });
        loginPageElement.style.opacity = '1'; 
      } else {
        console.error("No se encontró ningún elemento con la clase '.login-page-element'");
      }
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
