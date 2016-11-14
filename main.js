/**
 * Created by Joseph on 10/24/16.
 */

var inputs = $("#input");
var out = $("#output");
var head = $("#game");
var url = "https://golf-courses-api.herokuapp.com/";
var players = [];
function search(distance){
    $("#loading").show();
    out.html("");
    if(navigator.geolocation) {
        console.log("WE have a location.");
        navigator.geolocation.getCurrentPosition(

            function success(position){
                $.ajax({
                    url: url + "courses",
                    type: 'post',
                    dataType: 'json',
                    crossDomain: true,
                    headers:
                    {
                        ContentType : "application/x-www-form-urlencoded"
                    },
                    data:
                    {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        radius: distance
                    },
                    success: function(data){
                        console.log(data);

                        var buffer = "";

                        $("#loading").hide();
                        buffer += "<form id = 'courses'><select id = 'courseschoose' onchange = 'getTees();'>";
                        for(i in data.courses){
                            buffer += "<option value = '"+data.courses[i].id+"'>"+data.courses[i].name+"</option>";
                        }
                        buffer += "</select>Tee types<select id = 'teeselect'></select>";

                        buffer += "<button id = 'submit' onclick='getCourse($(\"select#courseschoose\").val(), $(\"select#teeselect\").val()); return false;'>Choose this Course</button>";


                        out.append(buffer);
                        getTees()
                    }

                });
            },
            function failure(){
                $("html").html("You did not accept the call for location. Accept it, and try again.")
            }


        );

    }
}
function getTees(){
    $("#teeselect").html("");
    $.ajax({
        url: url+ "courses/" + $("#courseschoose").val(),
        type: 'get',
        dataType: 'json',
        crossDomain: true,
        headers:
        {
            ContentType : "application/x-www-form-urlencoded"
        },
        success:function(data){
            var tee_boxes = data.course.holes[0].tee_boxes;
            console.log(tee_boxes);
            $(tee_boxes).each(function(i, d){
                $("#teeselect").append("<option value = '"+i+"'>"+d.tee_type+"</option>");
            });

        }
    })
}
function addPlayer(name){

    $("#colhead").append("<div class='cardlinehead'>"+name+"</div>");

    name = checName(name);
    players[players.length]=name;
    var count = 0;

    $(".holehead").each(function(data, value){
        $("#col"+count).append("<div id = 'par"+name+String(count)+"' class = 'cardcell'><input type = 'number' class = '"+name+"par parinput' onchange = 'for(var i in players)total(players[i]);'></div>");
        count++;
    });

    $("#totals").append("<div id = '"+name+"total' class='cardcell'>0</div>");
    $("#midtotal").append("<div id = '"+name+"midtotal' class='cardcell'>0</div>");
    $("#hightotal").append("<div id = '"+name+"hightotal' class='cardcell'>0</div>");
    $("#colhcp").append("<div class = 'cardcell'><input id = 'hcp-"+name+"' type = 'number' class = 'hcp' onchange = 'for(var i in players)total(players[i]);'></div>");
    return false;
}
function getCourse(id, tee){


    $("#search").dialog("close");
    out.html("");
    head.html("");
    $.get(url + "courses/" + id, function(data){
        data = JSON.parse(data);
        $("#title").html(data.course.name);

        head.append("<div id = 'colhead' class = 'col'>" +
            "<div class = 'cardlinehead'>Hole</div>" +
            "<div class = 'cardlinehead'>Par</div>" +
            "<div class = 'cardlinehead'>Yards</div>" +
            "<div class = 'cardlinehead'>Handicap</div>" +
            "</div>");
        var totalpar = 0;
        var totalyards = 0;
        head.append("<div id = 'colhcp' class = 'col'>Player's <br> Handicap</div>");
        for(i in data.course.holes){
            var hole = Number(i)+1;
            head.append("<div id = 'col"+i+"' class = 'col'><div class = 'holehead cardcell'>"+hole+"</div></div>");
            var thiscol = $("#col"+String(i));


            console.log(data.course.holes[i].tee_boxes);
            var par = data.course.holes[i].tee_boxes[tee].par;
            var yards = data.course.holes[i].tee_boxes[tee].yards;
            var handicap = data.course.holes[i].tee_boxes[tee].hcp;

            thiscol.append("<div id = 'par"+i+"' class = 'par cardcell'>"+par+"</div>");
            thiscol.append("<div id = 'yards"+i+"' class = 'yards cardcell'>"+yards+"</div>");
            thiscol.append("<div id = 'handicap"+i+"' class = 'handicap cardcell'>"+handicap+"</div>");

            totalyards += Number(yards);
            totalpar += Number(par);

            if (hole == 9 && data.course.holes.length == 18){
                head.append("<div id = 'midtotal' class = 'col othertotal'><div class = 'holehead cardcell total'>Out</div></div>");
                var lowtotal = 0;
                var lowyards = 0;
                for( var y = 0; y < 9; y ++){
                    lowtotal += Number($("#par"+String(y))[0].innerHTML);
                    lowyards += Number($("#yards"+String(y))[0].innerHTML);
                }
                $("#midtotal").append("<div class = 'midcardcell total cardcell'>"+lowtotal+"</div>");
                $("#midtotal").append("<div class = 'midcardcell total cardcell'>"+lowyards+"</div>");
                $("#midtotal").append("<div class = 'midcardcell total cardcell hcpp'>HCP</div>");
            }else if(hole == 18){
                head.append("<div id = 'hightotal' class = 'col othertotal'><div class = 'holehead cardcell total'>In</div></div>");
                var hightotal = 0;
                var highyards = 0;
                for( var y = 0; y < 9; y ++){
                    hightotal += Number($("#par"+String(y))[0].innerHTML);
                    highyards += Number($("#yards"+String(y))[0].innerHTML);
                }
                $("#hightotal").append("<div class = 'midcardcell total cardcell'>"+hightotal+"</div>");
                $("#hightotal").append("<div class = 'midcardcell total cardcell'>"+highyards+"</div>");
                $("#hightotal").append("<div class = 'midcardcell total cardcell hcpp'>HCP</div>");
            }
        }

        head.append("<div id = 'totals' class = 'col'><div class = 'cardcell'>Totals</div></div>");
        $("#totals").append("<div id = 'totalpar' class = 'total cardcell'>"+String(totalpar)+"</div>");
        $("#totals").append("<div id = 'totalyards' class = 'total cardcell'>"+String(totalyards)+"</div>");
        $("#totals").append("<div class = 'midcardcell total cardcell hcpp'>HCP</div>");
    });
    $("#play").append("<div id = 'addnewplayer'> " +
        "<button onclick = 'addPlayer(\"Player \"+String(players.length+1))'>Add Player</button> </div>");
    console.log($("html"));
    $("#play").show();
}

function total(name){
    var total = 0;
    var midtotal = 0;
    var hightotal = 0;
    var playerscores = $("."+name+"par");
    var isdone = true;
    var strokesgiven = 0;
    var playerhereHCP = $("#hcp-"+name).val();
    for(var x in players){
        var playerHcp = $("#hcp-"+players[x]).val();
        if((playerHcp>playerhereHCP) && (playerHcp-playerhereHCP>=strokesgiven)) strokesgiven = playerHcp-playerhereHCP;
    }
    playerscores.each(function(index, data){
        if(Number(data.value)==0){
            isdone = false;
        }

        total += Number(data.value);
        console.log($("#handicap"+index));
        if(index <= 8){
            midtotal += Number(data.value);
            if(Number($("#handicap"+index)[0].innerHTML)>(18-strokesgiven)) midtotal-=1;

        }else if(index > 8){
            hightotal += Number(data.value);
            if(Number($("#handicap"+index)[0].innerHTML)>(18-strokesgiven)) hightotal-=1;
        }

    });

    total -= strokesgiven;

    $("#"+name+"total").html(total);
    $("#"+name+"midtotal").html(midtotal);
    $("#"+name+"hightotal").html(hightotal);
    if(isdone && Number($("#"+name+"total")[0].innerHTML)<=Number($("#totalpar")[0].innerHTML)){
        confirm("Well done. Final Score?");
    } else if(isdone){
        confirm("Do better. Final Score?");
    }
}

function checName(name){
    name = name.replace(/\s+/g, '');
    for(var i = 0; i <=25; i++){
        if(players.indexOf(name) > -1){
            name += String(i);
        }else{
            break;
        }
    }
    return name;
}

$(function(){
    var opts = {
        lines: 11 // The number of lines to draw
        , length: 1 // The length of each line
        , width: 50 // The line thickness
        , radius: 0 // The radius of the inner circle
        , scale: 1 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#ffffff' // #rgb or #rrggbb or array of colors
        , opacity: .2 // Opacity of the lines
        , rotate: 55 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 1 // Rounds per second
        , trail: 60 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '190px' // Top position relative to parent
        , left: '50%' // Left position relative to parent
        , shadow: true // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'absolute' // Element positioning
    }

    var spinner = new Spinner(opts).spin(document.getElementById("loading"));

    $("#loading").hide();
    $("#search").dialog(
        {
            position: {
                my: 'center top',
                at: 'top+50'
            }
        });
    $(".ui-dialog-titlebar-close").html("X");
});