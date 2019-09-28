import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-maintainability',
  templateUrl: './maintainability.component.html',
  styleUrls: ['./maintainability.component.css']
})
export class MaintainabilityComponent implements OnInit {
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
    this.userService.getUserMaintainabilityStat(this.username)
      .subscribe(
        (res) => this.data = res,
        console.error
      );
  }

}
