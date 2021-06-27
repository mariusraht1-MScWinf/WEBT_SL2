class GdpPerCapita {
  static createChart() {
    let data = [2, 4, 8, 10];

    let svg = d3.select("#gdp_per_capita"),
      width = svg.attr("width"),
      height = svg.attr("height"),
      radius = Math.min(width, height) / 2,
      g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    let color = d3.scaleOrdinal(["#4daf4a", "#377eb8", "#ff7f00", "#984ea3", "#e41a1c"]);

    // Generate the pie
    let pie = d3.pie();

    // Generate the arcs
    let arc = d3.arc().innerRadius(0).outerRadius(radius);

    //Generate groups
    let arcs = g.selectAll("arc").data(pie(data)).enter().append("g").attr("class", "arc");

    //Draw arc paths
    arcs
      .append("path")
      .attr("fill", (d, i) => color(i))
      .attr("d", arc);
  }

  static getData() {
    return fetch("data/gdp_per_capita.json")
      .then((response) => response.json())
      .then((json) => json.sort((a, b) => d3.ascending(a.country, b.country)));
  }
}
