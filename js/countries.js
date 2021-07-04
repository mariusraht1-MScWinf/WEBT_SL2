class Countries {
  static data = [];

  static async getData() {
    if (!Countries.data || Countries.data.length == 0) {
      return fetch("data/countries.json")
        .then((response) => response.json())
        .then((json) => {
          Countries.data = json.sort((a, b) => d3.ascending(a.country, b.country));
          return json;
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
