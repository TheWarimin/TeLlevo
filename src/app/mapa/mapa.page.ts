import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  constructor(private router: Router, private activatedRouter: ActivatedRoute) { }

  showFiller = false;
  user={
    usuario:"",
    password:""
    };
    goTologin(){
      this.router.navigate(['/login'], { state: { user: this.user } });
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
