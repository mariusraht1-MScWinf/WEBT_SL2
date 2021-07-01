class GdpPerCapita {
  static createChart() {
    let data = [
      {
        value: 45229.245,
        color: "#4daf4a",
        label: "Belgium",
      },
      {
        value: 35220.084,
        color: "#377eb8",
        label: "Denmark",
      },
      {
        value: 34272.36,
        color: "#ff7f00",
        label: "Germany",
      },
      { value: 38605.671, color: "#984ea3", label: "Sweden" },
      {
        value: 39753.244,
        color: "#e41a1c",
        label: "Great Britain",
      },
      {
        value: 39753.244,
        color: "yellow",
        label: "Italy",
      },
      {
        value: 39753.244,
        color: "lightgreen",
        label: "Spain",
      },
      {
        value: 39753.244,
        color: "lightblue",
        label: "France",
      },
      {
        value: 39753.244,
        color: "orange",
        label: "United States",
        labelColor: "black",
        labelFontSize: "16",
      },
    ];

    let svg = d3.select("#gdp_per_capita"),
      width = svg.attr("width"),
      height = svg.attr("height"),
      radius = Math.min(width, height) / 2,
      g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    let color = d3.scaleOrdinal(data.map((d) => d.color));

    // Generate the pie
    let pie = d3.pie();

    // Generate the arcs
    let arc = d3.arc().innerRadius(0).outerRadius(radius);

    //Generate groups
    let arcs = g
      .selectAll("arc")
      .data(pie(data.map((d) => d.value)))
      .enter()
      .append("g")
      .attr("class", "arc");

    //Draw arc paths
    arcs
      .append("path")
      .attr("fill", (d, i) => color(i))
      .attr("d", arc);
  }

  static showData(code) {
    // TODO: Load all data for all countries
    fetch(`https://l1n.de/tl2/public/country/${code}/gdp_per_capita`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        data = [{ value: data, code: code, color: "red" }];
        GdpPerCapita.createChart(data);
      });
  }
}
