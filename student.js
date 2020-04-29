jQuery(document).ready(function() {
    clearInterval(search);
    var time = 0;
    var search = setInterval(async () => {
        if(time > 32) {
            clearInterval(search);
        } else if ($('.checkboxevent').length == 0 && $('li[event_id]').length !== 0) {
            clearInterval(search);
            await chrome.storage.sync.get(function(result) {
                var settings = result.settings;
                if(settings == undefined) {
                    settings = {
                        ac: true,
                        cc: true,
                        im: true,
                        pe: true,
                        ca: "pw"
                    }
                    chrome.storage.sync.set({settings: settings}, function() {
                        console.log('Value set');
                    });
                }
                if(settings.ac || settings.im) {
                    setChecks(result, settings);
                    importance(result);
                }
                if(settings.cc) {
                    setColors(result);
                }
                if(settings.pe) {
                    addEvent();
                }
                if(result.hc) {
                    $('#hideShow').prop('checked', true);
                }
            });
            console.log("Exists!");
        }
        time += 1;
    }, 64);

    function importance(result) {
        $('head').append(
            `<style>
                .block {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 2px solid gray;
                    cursor: default;
                }
                .popbut {
                    display: inline-block;
                    color: black; 
                    background-color: white;
                    text-align: center;
                    border-radius: 2px;
                    font-size: 10px;
                    width: 12px;
                    height: 12px;
                    margin-left: 5px;
                }
            </style>`
        )

        $("span.popbut").hover(function() {
            let id = $(this).attr("id");
            if($('div[popid="'+id+'"]').length) {
                $('div[popid="'+id+'"]').remove();
            } else {
                let pos = $(this).offset();
                $(this).append(
                    `<div 
                        popid="${id}"
                        class="popover in" 
                        style="display:block; top:${pos.top+12}px;left:${pos.left}px ">
                        
                        <div style="padding: 5px">
                            <p>Set importance based on color:</p>
                            <div class="block" style="background-color: red"></div>
                            <div class="block" style="background-color: orange"></div>
                            <div class="block" style="background-color: rgb(5, 192, 253)"></div>
                            <div class="block" style="background-color: lightGreen"></div>
                            <div class="block" style="background-color: none"></div>
                        </div>
                    </div>`);
            }
            $('div.block').click(function() {
                var importanceSet = result.importance;
                if(importanceSet == undefined) {
                    importanceSet = {};
                }
                let color = $(this).css('background-color');
                if(color == "rgba(0, 0, 0, 0)" || importanceSet[id] == color) {
                    $('li[event_id="'+id+'"]').css("border", "none");
                    delete importanceSet[id];
                } else {
                    $('li[event_id="'+id+'"]').css("border", "5px solid " + color);
                    importanceSet[id] = color;
                }
                chrome.storage.sync.set({importance: importanceSet}, function() {
                });
            });
        });
    }

    function setColors(result) {
        colors = result.test;
        if(colors == undefined) {
            colors = [];
        }
        $('li[event_id]').each(function() {
            let href = $(this).find('a[href]').attr('href');
            if(href.length < 10) {
                href = $(this).next().find('a[href]').attr('href');
            }
            href = href.substring(0,30);
            let classId = href.match(/\d{8}?/g).join('');
            for (let i = 0; i < colors.length; i++) {
                if(colors[i].id == classId) {
                    let rgb = colors[i].color.match(/[A-Za-z0-9]{2}/g).map(function(v) { return parseInt(v, 16) });
                    if ((rgb[0]*0.299 + rgb[1]*0.587 + rgb[2]*0.114) > 186){
                        $(this).css("color", "#000");
                    } else {
                        $(this).css("color", "#fff");
                    }
                    $(this).css("background-color", colors[i].color);
                    break;
                }
            }
        });
    }

    function setChecks(result, settings) {
        var checkedEvents = [];
        var events = result.events4;
        if(events == undefined) {
            events = [];
        }
        var importance = result.importance;
        if(importance == undefined) {
            importance = {};
        }

        $('li[event_id]').each(function() {
            let id = $(this).attr("event_id");
            if(settings.ac) {
                let isChecked = false;
                for(let i=0; i < events.length; i++) {
                    if(events[i] == id) {
                        isChecked = true;
                        checkedEvents.push(id);
                        break;
                    }
                }
                let checkbox = isChecked ? "checked": "";
                $(this).append('<input class="fi fi-info unsanitize checkboxevent" style="height: 12px; width: 12px;" type="checkbox" '+ checkbox +'>');
                if(isChecked) {
                    $(this).addClass("done");
                    if(result.hc) {
                        $(this).css("display", "none");
                    } else {
                        $(this).css("opacity", "0.35");
                    }
                }
            }
            if(settings.im) {
                $(this).append(`<span id="${id}" class="popbut"><b>!</b></span>`); //Importance hover element
                if(importance[id] !== undefined) {
                    $('li[event_id="'+id+'"]').css("border", "5px solid " + importance[id]);
                }
            }
        });

        if(settings.ac) {
            $('h3:nth-child(2)').append(`
                <input style="float: right; margin-left: 5px" id="hideShow" type="checkbox">
                <p style="float: right">Hide finished tasks: </p>
            `);

            $('#hideShow').click(function() {
                let checked = $(this).is(":checked");
                chrome.storage.sync.set({hc: checked}, function() {
                });
                if(checked) {
                    $('.done').css('display', 'none');
                } else {
                    $('.done').css('display', 'block');
                    $('.done').css("opacity", "0.35");
                }
            });

            $("input.checkboxevent").click(function() {
                let id = $(this).parent().attr("event_id");
                let checked = $(this).is(":checked");

                if(checked) {
                    checkedEvents.push(id);
                    $(this).parent().addClass("done");
                    if($('#hideShow').is(":checked")) {
                        $(this).parent().css("display", "none");
                    } else {
                        $(this).parent().css("opacity", "0.35");
                    }
               } else {
                    $(this).parent().css("opacity", "1");
                    $(this).parent().removeClass("done");
                    checkedEvents = checkedEvents.filter((val) => val != id);
                }
            
                chrome.storage.sync.set({events4: checkedEvents}, function() {
                    console.log('Value is set to ' + checkedEvents);
                });
            });
        }
    }

    function addEvent() {
        $('.sidebar > section:nth-child(2)').after(`<section>
        <h5 class="section-title optional">Actions</h5>
        <a class="btn btn-light addEvent" href="/student/events/new"><svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" class="fi fi-plus"><g fill="#ff0000" fill-rule="evenodd"><path d="M20 40C8.954 40 0 31.046 0 20S8.954 0 20 0s20 8.954 20 20-8.954 20-20 20zm0-38C10.06 2 2 10.06 2 20s8.06 18 18 18 18-8.06 18-18S29.94 2 20 2z"></path><path d="M30.667 21.333h-9.334v9.334a1.333 1.333 0 1 1-2.666 0v-9.334H9.333a1.333 1.333 0 1 1 0-2.666h9.334V9.333a1.333 1.333 0 1 1 2.666 0v9.334h9.334a1.333 1.333 0 1 1 0 2.666z" fill-rule="nonzero"></path></g></svg>
        Add Personal Event
        </a></section>`);
    }

});