import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  username: string;
  stats = {};

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.username = params['username'];
    });

    this.userService.getUserStat(this.username)
      .subscribe(
        (res) => {
          this.stats = res
          var ctx = document.getElementById('inspectChart');

          var data = {
            labels: ['Maintainability', 'Testing & Debugging', 'Flexibility to learn', 'Collaboration', 'General Statistics'],
            datasets: [
              {
                label: "Inspect Github User Profile",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                pointBackgroundColor: "rgba(255,99,132,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(255,99,132,1)",
                data: [
                  this.stats['maintainability'],
                  this.stats['debugging'],
                  this.stats['flexibility_to_learn'],
                  this.stats['collaboration'],
                  this.stats['general_statistics']
                ]
              }
            ]
          };

          var options = {
            tooltips: {
              mode: 'label'
            },
            scale: {
              ticks: {
                beginAtZero: true,
              }
            }
          };

          var myRadarChart = new Chart(ctx, {
            type: 'radar',
            data: data,
            options: options
          });
        },
        console.error
      );



  }

}
