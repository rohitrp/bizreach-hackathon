var myBarChart = new Chart(document.getElementById("bar-chart-grouped"), {
    type: 'bar',
    data: {
      labels: ["Repository 1", "Repository 2", "Repository 3", "Repository 4"],
      datasets: [
        {
          label: "Naming Conventions",
          backgroundColor: "#3e95cd",
          data: [95, 80, 98, 70]
        }, {
          label: "Documentation",
          backgroundColor: "#8e5ea2",
          data: [20, 30, 35, 15]
        }, {
            label: "Format Conventions",
            backgroundColor: "#26a69a",
            data: [50, 44, 60, 90]
        }, {
            label: "Code Consistency",
            backgroundColor: "#f57f17",
            data: [60, 23, 78, 60]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Population growth (millions)'
      }
    }
});
