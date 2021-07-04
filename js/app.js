class App {
  static init() {
    d3.formatDefaultLocale({
      decimal: ",",
      grouping: [3],
      thousands: ".",
      currency: "€",
    });

    App.showLoader("loader_vaccinations_over_time", true);
    App.showLoader("loader_gdp_per_capita", true);
    App.showLoader("loader_population_density", true);

    VaccinationsOverTime.fillCountriesSelect();
    PopulationDensity.showData();
    GdpPerCapita.showData();
  }

  static showLoader(id, show = false) {
    switch (show) {
      case true:
        document.querySelector("#" + id).classList.remove("d-none");
        break;
      case false:
        document.querySelector("#" + id).classList.add("d-none");
        break;
    }
  }
}
