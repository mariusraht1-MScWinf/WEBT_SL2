class PieChart {
  static onMouseover(svg, current) {
    document.body.style.cursor = "pointer";

    d3.select(current).selectAll("text").selectAll("tspan").attr("fill", "black");

    let others = svg.selectAll(".arc").filter(function (arc) {
      return this != current;
    });
    others.selectAll("path").attr("opacity", 0.3);
  }

  static onMouseout(svg, current) {
    document.body.style.cursor = "default";

    d3.select(current).attr("opacity", 1);
    d3.select(current).selectAll("text").selectAll("tspan").attr("fill", "white");

    let others = svg.selectAll(".arc").filter(function (arc) {
      return this != current;
    });
    others.selectAll("path").attr("opacity", 1);
  }
}
