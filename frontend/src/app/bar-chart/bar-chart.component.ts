import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements AfterViewInit {
  @Input() chart_name: string;
  @Input() data: any;

  constructor() { }

  ngAfterViewInit() {
    let datasets = [];
    const colors = ["#3e95cd", "#8e5ea2", "#26a69a", "#f57f17"];

    for (var i = 0; i < this.data.labels.length; i++) {
      datasets.push({
        "label": this.data.labels[i],
        "backgroundColor": colors[i],
        "data": []
      });
    }
    let labels = [];
    for (var i = 0; i < this.data.repos.length; i++) {
      const repo = this.data.repos[i];
      labels.push(repo.nameWithOwner);
      for (var j = 0; j < this.data.labels.length; j++) {
        datasets[j].data.push(repo.values[j]);
      }
    }
    

    var myBarChart = new Chart(document.getElementById("bar-chart-grouped"), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        title: {
          display: true,
          text: this.chart_name
        }
      }
    });

  }

}
