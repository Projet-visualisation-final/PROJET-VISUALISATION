var margin = { top: 30, right: 100, bottom: 70, left: 60 },
  width = 700 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;
var legende = d3.select("#legend").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "leg")
  .append("g")
  .attr("transform", "translate(150,20)");
//creation du svg
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

//map et projection
var projection = d3.geoMercator()
  .center([-3, 13])                // GPS of location to zoom on
  .scale(1000)                       // This is like the zoom
  .translate([width / 2, height / 2])

d3.json("data.geojson", function (error, dataGeo) {
//tooltip
  var div = d3
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
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .style("stroke-width", 1)
    .style("stroke", "black")
    .on("click", function (d, i) {
      nom = dataGeo.features[i].properties.name;
      console.log(nom);
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

function bubble() {
  var margin = { top: 100, right: 0, bottom: 0, left: 0 },
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    profondeur = 50,
    hauteur = Math.min(width, height) / 2;
//effacer le svg a chaque appel de la fonction
  var label = d3.selectAll(".lab");
  label.remove();
  var dot = d3.selectAll(".mdots");
  dot.remove();
  var plt = d3.select(".plot");
  plt.remove();
  var pa_nice = svg.selectAll(".cercles");
  pa_nice.remove();
  //recuperation du pays choisi
  var an = document.getElementById('choix').selectedOptions[0].text;
  //recuperationdes donnees 
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
      .transition()
      .duration(500)
      .ease(d3.easeBack)
      .attr("class", "cercles")
      .attr("cx", function (d) { return projection([+d.long, +d.lat])[0] })
      .attr("cy", function (d) { return projection([+d.lon, +d.lat])[1] })
      .attr("r", function (d) { return +d.valeur / 300 })
      .style("fill", "red")
      .style("opacity", .4)


    var canvas = d3.select("#barplot").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("x", 900)
      .attr("y", 20)
      .attr("class", "plot")
      .append("g")
      .attr("transform", "translate(355,150)");
     
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
        .outerRadius(function (d) { 0 })//hauteur des barres qui est en fonction du nombre de cas de cholera du pays
        .startAngle(function (d) { return x(d.pays); })//abcisse des barres
        .endAngle(function (d) { return x(d.pays) + x.bandwidth(); })//ordonnees des barres
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

    legende.selectAll("mydots")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", 400)
      .attr("class", "mdots")
      .attr("cy", function (d, i) { return i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7)
      .style("fill", function (d) { return d.co; })

    // Add one dot in the legend for each name.
    legende.selectAll("mylabels")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "lab")
      .attr("x", 420)
      .attr("y", function (d, i) { return i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", "black")
      .text(function (d) { return d.pays })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")

  })
}

function bar(pais) {
  var cartbart = d3.select("#chartbar");
  var vide = cartbart.selectAll('*');
  vide.remove();
  var margin1 = { top: 0, right: 50, bottom: 100, left: 100 },
    width1 = 600 - margin1.left - margin1.right,
    height1 = 350 - margin1.top - margin1.bottom;


  // append the svg object to the body of the page
  var svg = d3.select("#chartbar")
    .append("svg")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
    .append("g")
    .attr("transform",
      "translate(150," + margin1.top + ")");
     
  d3.csv("data.csv", function (error, data) {
    data = data.filter(function (d) { return d.pays == pais })
    console.log(function (d) { return d.pays })
    // X axis
    var x = d3.scaleBand()
      .range([0, width1])
      .domain(data.map(function (d) { return d.annees; }))
      .padding(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + height1 + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0,
        d3.max(data, function (d) {
          return +d.valeur;
        })])
      .range([height1, 0]);
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


var size = d3.scaleSqrt()
  .domain([1, 100])  // What's in the data, let's say it is percentage
  .range([1, 100])  // Size in pixel

// Ajout des circles

var values = ["1000", "5000", "20000", "45000"]
var valuesToShow = [10, 50, 100, 150]
var xCircle = 0
var xLabel = 250
var yCircle = 250
legende
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
legende
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
label = legende
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