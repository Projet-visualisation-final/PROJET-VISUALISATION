var margin = { top: 0, right: 0, bottom: 20, left: 0 },
  width = 1100 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;
var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip");
var opts = ["selectionnez une année", 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012];
var legende = d3.select("#legend").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "leg")
  .append("g")
  .attr("transform", "translate(150,60)");
function carte() {
  var plt = d3.select(".plot");
  plt.remove();
  var titre = d3.select(".titre");
  titre.remove();
  var action = d3.select(".action");
  action.remove();
  var ch = d3.select("#choix");
  ch.remove();
  //creation du svg
  var txt=d3.select("#message")
    .append("text")
    .attr("class","titre")
    .text("Vous avez choisi la representation des donnees sous forme de carte interactive");
    d3.select("#action")
    .append("text")
    .attr("class","action")
    .text("Cliquez sur un pays par voir la repartition du cholera entre 2000 et 2012 dans ce pays");
  var carte_selected = d3
    .select("#dropdown")
    .append("select")
    .attr("id", "choix")
    .attr("class", "form-control col-md-9 mt-4")
    .on("change", function (d) {
      var crt = d3.select(".carte");
      crt.remove();
      var loading = d3.select("#load");
      loading.remove();
      var plt = d3.select(".plot");
      plt.remove();
      var svg = d3.select("#my_dataviz")
        .style("background-color", "rgb(190, 189, 189)")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "carte");

      //map et projection
      var projection = d3.geoMercator()
        .center([5, 15])                // GPS of location to zoom on
        .scale(1000)                       // This is like the zoom
        .translate([width / 2, height / 2])

      d3.json("data.geojson", function (error, dataGeo) {
        //tooltip

        div
          .select("#tooltip")
          .attr("x", width - 600)
          .attr("y", 0)
          .style("opacity", 0)
          ;
        // creation de la carte
        svg.append("g")
          .selectAll("path")
          .data(dataGeo.features)
          .enter()
          .append("path")

          .attr("fill", "white")
          .attr("class", "carte")
          .attr("type", "button")
          .attr("data-toggle", "modal")
          .attr("data-target", "#exampleModal")
          .attr("d", d3.geoPath()
            .projection(projection)
          )
          .style("stroke-width", 1)
          .style("stroke", "black")
          .on("click", function (d, i) {
            nom = dataGeo.features[i].properties.name;
            self.bar(nom)

          })//evenement au survol
          .on("mouseover", function (d, i) {
            div
              .transition()
              .duration(200)
              .style("opacity", 0.9);
            div
              .html(dataGeo.features[i].properties.name)
              .style("left", d3.event.pageX + 10 + "px")
              .style("top", d3.event.pageY - 50 + "px");
          }

          )
          .on("mouseout", function (d) {
            div
              .transition()
              .duration(500)
              .style("opacity", 0);
          });


      }
      )
      var an = document.getElementById('choix').selectedOptions[0].text;
      d3.csv("data.csv", function (error, data) {
        data = data.filter(function (d) { return d.annees == an })
        var div = d3
          .select("#tooltip")
          .attr("x", width - 600)
          .attr("y", 0)
          .style("opacity", 0)
          ;
        //ajoit des cercles au a la carte
        svg
          .selectAll("myCircles")
          .data(data)
          .enter()
          .append("circle")
          .attr("class", "cercles")
          .attr("cx", function (d) { return projection([+d.long, +d.lat])[0] })
          .attr("cy", function (d) { return projection([+d.lon, +d.lat])[1] })
          .attr("r", function (d) { return +d.valeur / 300 })
          .style("fill", "red")
          .style("opacity", .5)
      })
      var size = d3.scaleSqrt()
        .domain([1, 100])  // What's in the data, let's say it is percentage
        .range([1, 100])  // Size in pixel

      // Ajout des circles

      var values = ["1000", "5000", "20000", "45000"]
      var valuesToShow = [10, 50, 100, 150]
      var xCircle = 850
      var xLabel = 1050
      var yCircle = 600
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function (d) { return yCircle - size(d) })
        .attr("r", function (d) { return size(d) })
        .style("fill", "none")
        .attr('stroke-width', '3')
        .attr("stroke", "black")

      // Ajout des segments
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
        .attr('x1', function (d) { return xCircle + size(d) })
        .attr('x2', xLabel)
        .attr('y1', function (d) { return yCircle - size(d) })
        .attr('y2', function (d) { return yCircle - size(d) })
        .attr('stroke', 'black')
        .attr('stroke-width', '3')
        .style('stroke-dasharray', ('2,2'))

      // Ajout des labels
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr('x', xLabel)
        .attr('y', function (d) { return yCircle - size(d) })
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')
        .text(function (d, i) { return values[i]; })
        .style("font-size", "16px")



    });


  carte_selected
    .selectAll("option")
    .data(opts)
    .enter()
    .append("option")
    .attr("value", function (d, i) {
      if (i == 0) {
        return "";
      }
      else {
        return d;
      }
    })
    .text(function (d) {
      return d;
    });
}

function barplot() {
  var margin = { top: 100, right: 0, bottom: 0, left: 0 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    profondeur = 50,
    hauteur = Math.min(width, height) / 2;
  //effacer le svg a chaque appel de la fonction
  var label = d3.selectAll(".lab");
  label.remove();
  var dot = d3.selectAll(".mdots");
  dot.remove();
  var crt = d3.select(".carte");
  crt.remove();
  var titre = d3.select(".titre");
  titre.remove();
  var action = d3.select(".action");
  action.remove();
  var plt = d3.select(".plot");
  plt.remove();
  var ch = d3.select("#choix");
  ch.remove();
  d3.select("#message")
    .append("text")
    .attr("class","titre")
    .text("Vous avez choisi la representation des donnees sous forme de barpot circulaire");
    d3.select("#action")
    .append("text")
    .attr("class","action")
    .text("Survolez les barres pour connaitre le nombre de cas!!");
  var item_selected = d3
    .select("#dropdown")
    .append("select")
    .attr("id", "choix")
    .attr("class", "form-control col-md-9 mt-4")
    .on("change", function (d) {
      var plt = d3.select(".plot");
      plt.remove();
      var label = d3.selectAll(".lab");
      label.remove();
      var dot = d3.selectAll(".mdots");
      dot.remove();
      var loading = d3.select("#load");
      loading.remove();
      //recuperation du pays choisi
      var an = document.getElementById('choix').selectedOptions[0].text;
      //recuperationdes donnees 
      d3.csv("data.csv", function (error, data) {
        data = data.filter(function (d) { return d.annees == an })

        div
          .select("#tooltip")
          .attr("x", width - 600)
          .attr("y", 0)
          .style("opacity", 0)
          ;

        var canvas = d3.select("#my_dataviz")
          .style("background-color", "rgb(190, 189, 189)")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .attr("x", 900)
          .attr("y", 20)
          .attr("class", "plot")
          .append("g")
          .attr("transform", "translate(450,250)");

        var x = d3.scaleBand()//definition de l'echelle de l'abcisse cad le cercle
          .range([0, 2 * Math.PI]) //on definit la taille du cercle
          .domain(data.map(function (d) { return d.pays; })); // on definit les donees qu'il contiendra

        var y = d3.scaleRadial()//l'echelle du cercle
          .range([profondeur, hauteur])   // intervalle dans laquelle les barres seront representes
          .domain([10, 13000]);

        // Ajout des bars
        var bar = canvas.append("g")
          .selectAll("path")
          .data(data)
          .enter()
          .append("path")
          .attr("fill", "red")
          .attr("d", d3.arc()// dessiner les barres
            .innerRadius(profondeur)//profondeur des barres
            .outerRadius(0)//hauteur des barres qui est en fonction du nombre de cas de cholera du pays
            .startAngle(0)//abcisse des barres
            .endAngle(0)//ordonnees des barres
            .padAngle(0.01))//espacement entre les barres
          .style("opacity", .3)
          .on("mouseover", function (d) {
            div
              .transition()
              .duration(200)
              .style("opacity", 0.9);
            div
              .html(d.valeur)
              .style("left", d3.event.pageX + 10 + "px")
              .style("top", d3.event.pageY - 50 + "px");
          })
          .on("mouseout", function (d) {
            div
              .transition()
              .duration(500)
              .style("opacity", 0);
          });

        bar.transition()
          .duration(1000)
          .attr("fill", function (d) { return (d.co) })
          .attr("d", d3.arc()// dessiner les barres
            .innerRadius(profondeur)//profondeur des barres
            .outerRadius(function (d) { return y(d['valeur']); })//hauteur des barres qui est en fonction du nombre de cas de cholera du pays
            .startAngle(function (d) { return x(d.pays); })//abcisse des barres
            .endAngle(function (d) { return x(d.pays) + x.bandwidth(); })//ordonnees des barres
            .padAngle(0.01))//espacement entre les barres
          .style("opacity", 1);

        canvas.selectAll("mydots")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", 400)
          .attr("class", "mdots")
          .attr("cy", function (d, i) { return i * 20 }) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("r", 7)
          .style("fill", function (d) { return d.co; })

        // Add one dot in the legend for each name.
        canvas.selectAll("mylabels")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "lab")
          .attr("x", 420)
          .attr("y", function (d, i) { return i * 20 }) // 100 is where the first dot appears. 25 is the distance between dots
          .style("fill", "black")
          .text(function (d) { return d.pays })
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")


      })


    });

  item_selected
    .selectAll("option")
    .data(opts)
    .enter()
    .append("option")
    .attr("value", function (d) {
      return d;
    })
    .text(function (d) {
      return d;
    });
}
function bar(pais) {
  var cartbart = d3.select("#modal");
  var vide = cartbart.selectAll('*');
  vide.remove();
  var margin1 = { top: 60, right: 0, bottom: 40, left: 100 },
    width1 = 650 - margin1.left - margin1.right,
    height1 = 350 - margin1.top - margin1.bottom;


  // append the svg object to the body of the page
  var svg = d3.select("#modal")
    .append("svg")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
    .append("g")
    .attr("transform",
      "translate(110," + margin1.top + ")");
  svg
    .append("text")
    .attr("class", "titre")
    .attr("x", 0)
    .attr("y", -30)
    .style("font-weight", "bold")
    .text("Repartition du cholera entre 2000 et 2012 dans le pays: " + pais);
  d3.csv("data.csv", function (error, data) {
    data = data.filter(function (d) { return d.pays == pais })
    console.log(function (d) { return d.pays })
    // X axis
    var x = d3.scaleBand()
      .range([0, width1])
      .domain(data.map(function (d) { return d.annees; }))
      .padding(0.2);
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0,
        d3.max(data, function (d) {
          return +d.valeur;
        })])
      .range([height1, 0]);
    svg.append("g")
      .attr("transform", "translate(0," + height1 + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g")
      .call(d3.axisLeft(y));
    //ajout des barres
    svg
      .selectAll("rectangle")
      .data(data)
      .enter()
      .append("rect")
      .transition()
      .duration(200)
      .delay(function (d, i) {
        return i * 50;
      })
      .attr("x", function (d) { return x(d.annees); })
      .attr("y", function (d) { return y(d.valeur); })
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return height1 - y(d.valeur); })
      .attr("fill", "red")



  });
}

