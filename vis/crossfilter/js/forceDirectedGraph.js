// d3 v4 FDG: https://bl.ocks.org/heybignick/3faf257bbbbc7743bb72310d03b86ee8

function forceDirectedGraph() {

    var margin = { top: 20, right: 20, bottom: 20, left: 20},
        width = 400,
        height = 400,
        nodeValues = function(d) { return d[0];},
        linkValues = function(d) { return d[1];},
        color = d3.scaleOrdinal(d3.schemeCategory20),
        simulation = d3.forceSimulation()
                        .force("link", d3.forceLink().id(function(d) { return d.id; }))
                        .force("charge", d3.forceManyBody())
                        .force("center", d3.forceCenter(width + 100 / 2, height / 2));

    function chart(selection) {
        selection.each(function(data) {

            console.log('Inside FDG Chart');
            console.log('W ' + width + ' - H ' + height)
            console.log(data);
            console.log(selection);

            // d3.select(this).select("#forcegraph").attr("width", width).attr("height", height)

            // 'this' refers to the selection
            var link = d3.select(this)
                        .append("g")
                        .attr("class", "links")
                        .selectAll("line")
                        .data(data.links)
                        .enter()
                        .append("line")
                        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

            var node = d3.select(this)
                        .append("g")
                        .attr("class", "nodes")
                        .selectAll("g")
                        .data(data.nodes)
                        .enter().append("g")

            var circles = node.append("circle")
                        .attr("r", 5)
                        .attr("fill", function(d) { return color(d.group); })
                        .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended));

            var lables = node.append("text")
                        .text(function(d) {
                            return d.id;
                        })
                        .attr('x', 6)
                        .attr('y', 3);

            node.append("title")
                .text(function(d) { return d.id; });
                  
            simulation.nodes(data.nodes)
                        .on("tick", ticked);
                  
            simulation.force("link")
                .links(data.links);
                  
            function ticked() {
                    link
                        .attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });
                
                    node
                        .attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")";
                        })
                }
                });
                  
            function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
            }
            
            function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
            }
            
            function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
            }
        };

    chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
    };

    chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
    };

    chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
    };

    chart.nodes = function(_) {
    if (!arguments.length) return nodeValues;
    nodeValues = _;
    return chart;
    };

    chart.links = function(_) {
    if (!arguments.length) return linkValues;
    linkValues = _;
    return chart;
    };

    return chart;
}