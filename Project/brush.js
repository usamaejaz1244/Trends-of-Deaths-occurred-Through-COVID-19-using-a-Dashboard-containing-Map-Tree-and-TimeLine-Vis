if(!d3.chart) d3.chart = {};

d3.chart.brush = function() {
    var g;
    var data;
    var width = 600;
    var height = 30;
    var dispatch = d3.dispatch(chart, "filter");

    function chart(container) {
        g = container;

        var extent = [new Date('2020-01-01').getTime(),new Date('2020-06-10').getTime()]

        var scale = d3.time.scale()
            .domain(extent)
            .range([0, width])

        var brush = d3.svg.brush()
        brush.x(scale)
        brush(g)
        g.selectAll("rect").attr("height", height)
        g.selectAll(".background")
            .style({fill: "#A0CBE8", visibility: "visible"})
        g.selectAll(".extent")
            .style({fill: "#696", visibility: "visible"})
        g.selectAll(".resize rect")
            .style({fill: "#A87", visibility: "visible"})

        // var rects = g.selectAll("rect.events")
        //     .data([1])
        // rects.enter()
        //     .append("rect").classed("events", true)
        // rects.attr({
        //     // x: function(d) { return scale(d.created);},
        //     // y: 0,
        //     width: width,
        //     height: height
        // }).style("pointer-events", "none")
        //     .style("fill", function(d) {  return '#A0CBE8' })


        // rects.exit().remove()

        brush.on("brushend", function() {
            var ext = brush.extent()
            ext = ext.map(function (e) {
                return e.getTime()
            })
            if ((ext[1]-ext[0]) === 0) {
                dispatch.filter(data)
                return
            }

            var filtered = data.map(function(d) {
                var e = JSON.parse(JSON.stringify(d));
                e.cases = d.cases.filter(function (c) {
                    return (+c.key > ext[0] && +c.key < ext[1])
                })
                return e
            })

            // var filtered = data.filter(function(d) {
            //     return (d.created > ext[0] && d.created < ext[1])
            // })
            g.selectAll("rect.events")
                .style("stroke", "")

            g.selectAll("rect.events")
                .data(filtered, function(d) { return d.id })
                .style({
                    stroke: "#696"
                })

            //emit filtered data
            dispatch.filter(filtered)
        })

        var axis = d3.svg.axis()
            .scale(scale)
            .orient("bottom")
            .tickValues([new Date(extent[0]), new Date(extent[0] + (extent[1] - extent[0])/2) , new Date(extent[1])])
            .tickFormat(d3.time.format("%x"))


        var agroup = g.append("g")
        agroup.attr("transform", "translate(" + [0, height] + ")")
        axis(agroup)
        agroup.selectAll("path")
            .style({ fill: "none", stroke: "#000"})
        agroup.selectAll("line")
            .style({ stroke: "#000"})
    }

    chart.highlight = function(data) {
        var rects = g.selectAll("rect.events")
            .style("stroke", "")
            .style("stroke-width", "")

        rects.data(data, function(d) { return d.id })
            .style("stroke", "black")
            .style("stroke-width", 1)
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

    return d3.rebind(chart, dispatch, "on");
}