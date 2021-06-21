class VaccinationsOverTime {
  static fillCountriesSelect() {
    return fetch("data/countries.json")
      .then((response) => response.json())
      .then((json) => json.sort((a, b) => d3.ascending(a.country, b.country)))
      .then((json) => {
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

  static create_chart() {
    var margin = { top: 20, right: 20, bottom: 40, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    var svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear().domain([0, 100]).range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width / 2 + 24)
      .attr("y", height + margin.top + 20)
      .text("Datum");

    svg
      .append("text")
      .attr("transform", "rotate(90)")
      .attr("y", margin.left - 20)
      .attr("x", height / 4)
      .text("Impfungen (kummuliert)");
  }

  static showData(code) {
    console.log(`Show data by code ${code}...`);
    fetch(`https://l1n.de/tl2/public/country/${code}/vaccinations`)
      .then((response) => response.json())
      .then((json) => console.log(json));
  }

  static onChangeSelectCountries(selectedItem) {
    let code = selectedItem.selectedOptions[0].dataset.code;
    VaccinationsOverTime.showData(code);
  }
}
