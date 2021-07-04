class GdpPerCapita {
  static createChart(data, onresize = false) {
    d3.selectAll("#gdp_per_capita > *").remove();
    if (!data || data.length == 0) return;

    let svg = d3.select("#gdp_per_capita"),
      width = document.getElementById("gdp_per_capita").parentElement.clientWidth - 20,
      height = width, // make it square
      radius = Math.min(width, height) / 2,
      g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    svg.attr("width", width).attr("height", height);

    if (!onresize) {
      window.addEventListener("resize", function () {
        let svg = d3.select("#gdp_per_capita");
        let w = svg.node().parentElement.clientWidth - 20;
        svg.attr("width", w).attr("height", w);
        GdpPerCapita.createChart(data, true);
      });
    }

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
      .attr("class", "arc")
      .on("mouseover", function () {
        PieChart.onMouseover(svg, this);
      })
      .on("mouseout", function () {
        PieChart.onMouseout(svg, this);
      });

    arcs
      .append("path")
      .attr("fill", (d, i) => color(i))
      .attr("d", arc);

    arcs
      .append("svg:text")
      .attr("transform", (d) => "translate(" + arc.centroid(d) + ")")
      .attr("text-anchor", "middle")
      .append("tspan")
      .attr("fill", "white")
      .attr("font-size", ".9em")
      .attr("font-weight", "bold")
      .text((d, i) => data[i].label);

    arcs
      .selectAll("text")
      .append("tspan")
      .attr("class", "text")
      .attr("fill", "white")
      .attr("font-size", ".9em")
      .attr("x", "0")
      .attr("dy", "1.2em")
      .text((d, i) => d3.format(",d")(d.value));

    App.showLoader("loader_gdp_per_capita", false);
  }

  static showData() {
    let dataset = [];
    let color = ["#e2bed3", "#22c1c3", "#fcb045", "#e6d358", "#7ee3b1", "#e6fc46", "#fc6446", "#8c9ade", "#fc466b"];
    Countries.getData().then((countries) => {
      if (!countries || countries.length == 0) return;
      Promise.all(countries.map((country) => fetch(`https://l1n.de/tl2/public/country/${country.code}/gdp_per_capita`)))
        .then((responses) => Promise.all(responses.map((response) => response.json())))
        .then((data) => {
          countries.forEach((country, index) => {
            dataset.push({ value: data[index], color: color.pop(), label: country.country });
          });
          GdpPerCapita.createChart(dataset);
        })
        .catch((error) => App.showError("loader_gdp_per_capita", true));
    });
  }
}
