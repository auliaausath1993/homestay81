import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-waitingscreen',
  templateUrl: './waitingscreen.page.html',
  styleUrls: ['./waitingscreen.page.scss'],
})
export class WaitingscreenPage implements OnInit {

  constructor(
    private router: Router,
    private storage: StorageMap
  ) { 
    setTimeout( () => {
      this.storage.get('user').subscribe((user) => {
        //console.log(user);
        if(user){
          this.router.navigateByUrl("/login");
        }else{
          this.router.navigateByUrl("/login");
        }
      });
    }, 1500);
  }

  ngOnInit() {
  }

}
