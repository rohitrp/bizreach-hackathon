import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-general-stat',
  templateUrl: './general-stat.component.html',
  styleUrls: ['./general-stat.component.css']
})
export class GeneralStatComponent implements OnInit {

  data: any;
  username: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.username = params['username'];
    });
    this.userService.getGeneralStat(this.username)
      .subscribe(
        (res) => {
          this.data = res;
          
        },
        console.error
      );
  }

}
