var ctx = document.getElementById('compareChart');

var data = {
  labels: ['Maintainability', 'Testing & Debugging', 'Flexibility to learn', 'Team Work', 'General Statistics'],
  datasets: [
      {
          label: "User Profile 1",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          pointBackgroundColor: "rgba(255,99,132,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(255,99,132,1)",
          data: [63, 20, 46, 50, 90]
      }, {
            label: "User Profile 2",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointBackgroundColor: "rgba(179,181,198,1)",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(179,181,198,1)",
            data: [46, 57, 80, 32, 15]
    }
  ]
};

var options = {
  tooltips: {
    mode: 'label'
  },
  scales: {
      yAxes: [{
          ticks: {
              beginAtZero:true
          }
      }]
  }
};



var myRadarChart = new Chart(ctx, {
            type: 'radar',
            data: data,
            options: options
});
