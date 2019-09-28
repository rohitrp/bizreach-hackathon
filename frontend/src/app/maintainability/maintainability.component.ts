import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-maintainability',
  templateUrl: './maintainability.component.html',
  styleUrls: ['./maintainability.component.css']
})
export class MaintainabilityComponent implements OnInit {
//   data = {
//         "labels": [
//             "style",
//             "comment",
//             "variable",
//             "format"
//         ],
//         "repos": [
//             {
//                 "nameWithOwner": "rohitrp/Portfolio-app",
//                 "values": [
//                     100,
//                     11.407014449880531,
//                     100,
//                     100
//                 ]
//             },
//             {
//                 "nameWithOwner": "rohitrp/PopularMoviesApp",
//                 "values": [
//                     100,
//                     7.5097335577444735,
//                     100,
//                     100
//                 ]
//             },
//             {
//                 "nameWithOwner": "gj100596/HelpingHands",
//                 "values": [
//                     100,
//                     17.296389055332664,
//                     100,
//                     100
//                 ]
//             },
//             {
//                 "nameWithOwner": "rohitrp/HelpingHands",
//                 "values": [
//                     100,
//                     16.743604470438672,
//                     100,
//                     100
//                 ]
//             }
//         ]
// };
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
        (res) => {
          this.data = res;
          console.log(this.data);
          
        },
        console.error
      );
  }

}
