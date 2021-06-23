class VaccinationsOverTime {
  static svg;
  static groupKey = "date";
  static keys;
  static x;
  static y;
  static margin = { top: 20, right: 20, bottom: 40, left: 90 };
  static width = 860 - this.margin.left - this.margin.right;
  static height = 600 - this.margin.top - this.margin.bottom;

  static fillCountriesSelect() {
    Countries.getData().then((json) => {
      console.log(json);

      json.forEach((entry) => {
        let option = document.createElement("option");
        option.text = entry.country;
        option.dataset.code = entry.code;
        document.querySelector("#countries").append(option);
      });

      d3.select("#countries").selectAll("option").data(json);
    });
  }

  static create_chart(data) {
    if (this.svg) d3.select("#chart").select("svg").remove();

    this.svg = d3
      .select("#chart")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", this.width / 2 + 24)
      .attr("y", this.height + this.margin.top + 20)
      .text("Datum");

    this.svg
      .append("text")
      .attr("transform", "rotate(90)")
      .attr("y", this.margin.left - 10)
      .attr("x", this.height / 4)
      .text("Impfungen (kummuliert)");

    this.x = d3.scaleTime().range([0, this.width]);
    this.x.domain(d3.extent(data, (d) => new Date(d.date)));
    this.svg
      .append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.x).tickFormat(d3.timeFormat("%Y-%m-%d")));

    this.y = d3.scaleLinear().range([this.height, 0]);
    this.y.domain([
      0,
      d3.max(data, function (d) {
        return d.total_vaccinations;
      }),
    ]);

    this.svg.append("g").attr("class", "axis").call(d3.axisLeft(this.y));
  }

  static showData(code) {
    fetch(`https://l1n.de/tl2/public/country/${code}/vaccinations`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        VaccinationsOverTime.create_chart(data);
      });
  }

  static onChangeSelectCountries(selectedItem) {
    let code = selectedItem.selectedOptions[0].dataset.code;
    VaccinationsOverTime.showData(code);
  }
}
