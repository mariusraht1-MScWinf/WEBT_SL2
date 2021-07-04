class Countries {
  static data = [];

  static async getData() {
    if (!Countries.data || Countries.data.length == 0) {
      return fetch("data/countries.json")
        .then((response) => response.json())
        .then((json) => {
          Countries.data = json.sort((a, b) => d3.ascending(a.country, b.country));
          return json;
        })
        .catch((error) => {
          App.showError("loader_vaccinations_over_time", true);
          App.showError("loader_gdp_per_capita", true);
          App.showError("loader_population_density", true);
          console.log(error);
        });
    }
    return Countries.data;
  }

  static onChangeSelectCountries(selectedItem) {
    let code = selectedItem.selectedOptions[0].dataset.code;
    VaccinationsOverTime.showData(code);
    GdpPerCapita.showData(code);
  }
}
