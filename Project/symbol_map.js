if(!d3.chart) d3.chart = {};

d3.chart.symbol_map = function() {
    var g;
    var data;
    var width = 800;
    var height = 400;
    var cx = 10;
    var size_scale = 250;
    var dispatch = d3.dispatch(chart, "hover");
    var max;

    var projection = d3.geo.albersUsa()
        .translate([500, 230])
        .scale([500]);


    function chart(container) {
        g = container;
        update();
    }
    chart.update = update;

    function update() {

        var symbols = g.selectAll("circle")
            .data(data.sort(function(a, b) { return b.agprod - a.agprod; }), key);

        symbols.enter().append("circle");


        symbols
            .transition()
            .attr("cx", function(d) {
                return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function(d) {
                return projection([d.lon, d.lat])[1];
            })
            .attr("r", function(d) {
                var total = d.cases.slice(-1)[0].values - d.cases[0].values
                return Math.sqrt((total / max) * size_scale);
            })
            .style("fill", function(d) {
                return '#000000';
            })
            .style("opacity", 0.75)
            .attr("class", "symbol")
            .attr("title", function(d) { return "Productivity for " + d.id + ": " + d.agprod; });


        symbols.exit()
            //.transition()
            .remove();


        symbols.on("mouseover", function(d) {
            d3.select(this).style("stroke", "black")
            dispatch.hover([d])
        })

        symbols.on("mouseout", function(d) {
            d3.select(this).style("stroke", "")
            dispatch.hover([])
        })
    }

    chart.highlight = function(data) {
        var symbols = g.selectAll("circle.symbol")
            .style("stroke", "")
            .style("stroke-width", "")

        symbols.data(data, key)
            .style("stroke", "black")
            .style("stroke-width", 3)
    }

    chart.data = function(value) {
        if(!arguments.length) return data;
        data = value;
        return chart;
    }
    chart.width = function(value) {
        if(!arguments.length) return width;
        width = value;
        return chart;
    }
    chart.height = function(value) {
        if(!arguments.length) return height;
        height = value;
        return chart;
    }

    chart.max = function(value) {
        if(!arguments.length) return max;
        max = value;
        return chart;
    }

    var key = function(d) {
        return d.id;
    };

    return d3.rebind(chart, dispatch, "on");
}