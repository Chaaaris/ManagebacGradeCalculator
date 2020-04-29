jQuery(document).ready(function() {
  clearInterval(checkExist);

    var time = 0;
    var checkExist = setInterval(function() {
        if(time > 128) {
            clearInterval(checkExist);
        }
        if ($('.content-block > h3:nth-child(3)').length != 0 && $('#colortest').length == 0) {
            clearInterval(checkExist);
            console.log("Exists!");
            pickColor();
        }
        time += 1;
     }, 32);
    
    function pickColor() {
      chrome.storage.sync.get(['test'], function(result) {
        colors = result.test;
        if(colors == undefined) {
            colors = [];
        }
        let href = window.location.href;
        let classId = href.match(/\d/g).join('');
        if(colors.length == 0) {
          $('.content-block > h3:nth-child(3)').append('<input style="margin-left: 10px" id="colortest" type="color" value="#ff0000" />');
        }

        for (let i = 0; i < colors.length; i++) {
          if(colors[i].id == classId) {
            $('.content-block > h3:nth-child(3)').append('<input style="margin-left: 10px" id="colortest" type="color" value=' + colors[i].color + ' />');
            break;
          } else if(i == colors.length-1) {
            $('.content-block > h3:nth-child(3)').append('<input style="margin-left: 10px" id="colortest" type="color" value="#ff0000" />');
          }
        }
        $('.content-block > h3:nth-child(3)').append('<button id="setcolor">Set</button>')
        
        $('#setcolor').click(function() {
          let colorChosen = $('#colortest').val();
          let thisClass = {
            id: classId,
            color: colorChosen
          }
          if(colors.length == 0) {
            colors.push(thisClass);
          }

          for (let i = 0; i < colors.length; i++) {
            if(colors[i].id == classId) {
              colors[i] = thisClass;
              break;
            } else if(i == colors.length-1) {
              colors.push(thisClass);
            }
          }
          chrome.storage.sync.set({test: colors}, function() {
            console.log('Value is set to ' + colors);
          });
        
        });
      });
    }

});