var myBarChart = new Chart(document.getElementById("compareBarChart"), {
    type: 'bar',
    data: {
      labels: ["Naming Conventions", "Documentation", "Format Conventions", "Code Consistency"],
      datasets: [
        {
          label: "Naming Conventions",
          backgroundColor: "#3e95cd",
          data: [95, 80, 98, 70]
        }, {
          label: "Documentation",
          backgroundColor: "#8e5ea2",
          data: [20, 30, 35, 15]
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
