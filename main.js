/**
 * Created by Joseph on 10/24/16.
 */

var inputs = $("#input");
var out = $("#output");
var head = $("#game");
var url = "http://golf-courses-api.herokuapp.com/";
var players = [];
function search(distance){
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
                        out.append("<form id = 'courses'>");
                        for(i in data.courses){
                            out.append("<div class = 'course'><input type = 'radio' name = 'course' value = '"+data.courses[i].id+"'>"+data.courses[i].name+"</div>");
                        }
                        out.append("<button id = 'submit' onclick='getCourse($(\"input:radio[name=course]\").val())'>Choose this Course</button></form>");
                    }

                });
            },
            function failure(){
                console.log("WAHTAHTHA")
            }


        );

    }
}
function getCourse(id){
    $("#search").dialog("close");
    out.html("");
    head.html("");
    $.get(url + "courses/" + id, function(data){
        console.log(data);
        data = JSON.parse(data);
        head.append("<div id = 'colhead' class = 'col'>" +
            "<div>Hole</div><div>Par</div><div>Yards</div>" +
            "</div>");
        for(i in data.course.holes){
            var hole = Number(i)+1;
            head.append("<div id = 'col"+i+"' class = 'col'><div class = 'holehead'>"+hole+"</div></div>");
            var thiscol = $("#col"+String(i));
            thiscol.append("<div id = 'par"+i+"'>"+data.course.holes[i].tee_boxes[0].par+"</div>");
            thiscol.append("<div id = 'yards"+i+"'>"+data.course.holes[i].tee_boxes[0].yards+"</div>");
            $(players).each(function(data, value){
                thiscol.append("<div id = 'par"+value+data+"'><input type = 'number' class = '"+value+"par' onchange='total(\""+value+"\")'></div>");
            });
        }
        head.append("<div id = 'totals' class = 'col'>Totals</div>");
        $(players).each(function(data, value){
            $("#colhead").append("<div class = 'namehead'>"+value+"</div>");
            $("#totals").append("<div id = '"+value+"total'>0</div>");
        });
    });
}

function addPlayer(name){
    name = checName(name);
    players[players.length]=name;
    var count = 0;
    $("#colhead").append("<div>"+name+"</div>");
    $(".holehead").each(function(data, value){
        $("#col"+count).append("<div id = 'par"+name+String(count)+"'><input type = 'number' class = '"+name+"par' onchange = 'total(\""+name+"\")'></div>");
        count++;
    });
    $("#totals").append("<div id = '"+name+"total'>0</div>");
    $("#players").append("<div class = 'name'>"+String(players.length)+" "+name+"</div>");
}

function total(name){
    var total = 0;
    var player = $("."+name+"par");
    player.each(function(index, data){
        total += Number(data.value);
    });
    $("#"+name+"total").html(total);
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
        $("#search").dialog();
        $(".ui-dialog-titlebar-close").html("X")
});