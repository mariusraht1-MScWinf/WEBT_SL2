class Countries {
  data = [];

  static async getData() {
    const response = await fetch("data/countries.json");
    const json = await response.json();
    return json.sort((a, b) => d3.ascending(a.country, b.country));
  }
}
