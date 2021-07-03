class GdpPerCapita {
  static createChart() {
    let data = [
      {
        value: 45229.245,
        color: "#e2bed3",
        label: "Belgium",
      },
      {
        value: 35220.084,
        color: "#22c1c3",
        label: "Denmark",
      },
      {
        value: 34272.36,
        color: "#fcb045",
        label: "Germany",
      },
      { value: 38605.671, 
        color: "#e6d358", 
        label: "Sweden" 
      },
      {
        value: 39753.244,
        color: "#7ee3b1",
        label: "Great Britain",
      },
      {
        value: 39753.244,
        color: "#e6fc46",
        label: "Italy",
      },
      {
        value: 39753.244,
        color: "#fc6446",
        label: "Spain",
      },
      {
        value: 39753.244,
        color: "#8c9ade",
        label: "France",
      },
      {
        value: 39753.244,
        color: "#fc466b",
        label: "United States",
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
      .attr("class", "arc")
      .on('mouseover', function() {
        var current = this
        var others = svg.selectAll(".arc").filter(function(el) {
          return this != current
        });
        others.selectAll("path").style('opacity', 0.3);
      })
      .on('mouseout', function() {
        var current = this;
        d3.select(this)
          .style('opacity', 1);
        var others = svg.selectAll(".arc").filter(function(el) {
          return this != current
        });
        others.selectAll("path").style('opacity', 1);
      });
    arcs
      .append("path")
      .attr("fill", (d, i) => color(i))
      .attr("d", arc);
    arcs
       .append("svg:text")
       .attr( "transform",function(d) {
       var c = arc.centroid(d);
       return "translate("+ arc.centroid(d) + ")"; })
      .attr("text-anchor","middle")
      .style("font-size","18px")
      .style("text-decoration","bold")
      .text(function(d,i) { return data[i].label;});
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
