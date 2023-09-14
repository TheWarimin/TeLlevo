import { Component,OnInit } from '@angular/core';
import { Router, NavigationExtras  } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
 
  constructor(private route: ActivatedRoute, private router: Router) {
    
  }
  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    
  }
}
