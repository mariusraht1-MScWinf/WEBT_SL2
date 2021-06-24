
class GdpPerCapita {
    static svg;
}
function GdpPerCapita(values) {

    var chart = new CanvasJS.Chart("GdpPerCapita", {
      backgroundColor: "white",
      colorSet: "colorSet2",
  
      title: {
        text: "GdpPerCapita",
               fontFamily: "Verdana",
        fontSize: 25,
        fontWeight: "normal",
      },
      animationEnabled: true,
      data: [{
        indexLabelFontSize: 15,
        indexLabelFontFamily: "Monospace",
        indexLabelFontColor: "darkgrey",
        indexLabelLineColor: "darkgrey",
        indexLabelPlacement: "outside",
        type: "pie",
        showInLegend: false,
        toolTipContent: "<strong>#percent%</strong>",
        dataPoints: values
      }]
    });
    chart.render();
  }

  renderGdpPerCapita(GdpPerCapitaValues);
  
  function renderGdpPerCapita(values) {
  
    var chart = new CanvasJS.Chart("GdpPerCapita", {
      backgroundColor: "white",
      colorSet: "colorSet3",
      title: {
        text: "GdpPerCapita",
        fontFamily: "Verdana",
        fontSize: 25,
        fontWeight: "normal",
      },
      animationEnabled: true,
      legend: {
        verticalAlign: "bottom",
        horizontalAlign: "center"
      },
      theme: "theme2",
      data: [
  
        {
          indexLabelFontSize: 15,
          indexLabelFontFamily: "Monospace",
          indexLabelFontColor: "darkgrey",
          indexLabelLineColor: "darkgrey",
          indexLabelPlacement: "outside",
          type: "column",
          showInLegend: false,
          legendMarkerColor: "grey",
          dataPoints: values
        }
      ]
    });
  
    chart.render();
  }
       


   
              
                  
                   