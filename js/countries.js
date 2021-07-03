class Countries {
  static data = [];

  static getData() {
    if (!Countries.data || Countries.data.length == 0) {
      Countries.data = fetch("data/countries.json")
        .then((response) => response.json())
        .then((json) => json.sort((a, b) => d3.ascending(a.country, b.country)));
    }
    return Countries.data;
  }

  static onChangeSelectCountries(selectedItem) {
    let code = selectedItem.selectedOptions[0].dataset.code;
    VaccinationsOverTime.showData(code);
    GdpPerCapita.showData(code);
  }
}
