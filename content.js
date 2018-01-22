jQuery(document).ready(function() {console.log("ready");

var categories = [];

$('.table-condensed tbody tr').each(function(i) {
  var cat = {}
  cat.name = $(this).children().first().text();
  cat.weight = Number($(this).find('.text-right').text().replace(/[^0-9]+/g, ""));
  cat.grades = getGrade(cat.name)
  cat.avg = getAvg(cat.grades)
  cat.specialNum = cat.avg * cat.weight / 100;
  categories.push(cat)
})

function getGrade(cat) {
  var grades = [];
  $('.label-score').each(function(i) {
    if(cat.indexOf($(this).parent().parent().children().last().text()) > -1) {
      var a = $(this).text();
      var b = a.split('/').map(function(item) {
        return parseInt(item, 10);
      });
      grades.push(Math.round(b[0] / b[1] * 100 * 100) / 100);
    }
  })
  return grades;
}

function getAvg(grades) {
  var sum = 0;
  for(var i = 0; i < grades.length; i++) {
    sum += parseInt(grades[i], 10);
  }
  return sum/grades.length;
}

function fresult() {
  var sumWeight = 0;
  var sumSpecial = 0;
  for (var i = 0; i < categories.length; i++) {
    if(isNaN(categories[i].avg)) {
      console.log("NAN" + categories[i].name);
    } else {
      sumWeight += categories[i].weight;
    }
  }
  for (var i = 0; i < categories.length; i++) {
    if(isNaN(categories[i].avg)) {
      console.log("NAN" + categories[i].name);
    } else {
      sumSpecial += categories[i].specialNum;
    }
  }
  return sumSpecial / sumWeight * 100;
}

//console.log(fresult());
var form = document.getElementsByClassName("simple_form")[0];
var result = document.createElement('h3');
result.style.color = "red";
result.innerHTML = "Grade: " + Math.round(fresult() * 100) / 100 + "%";
form.appendChild(result)

var body = document.getElementsByClassName('content-block')[0];
var info = document.createElement('h4');
info.innerHTML = "You can change the grades in this table and calculate your grade again:";
body.appendChild(info);

var tbl = document.createElement('table');
tbl.setAttribute('id', 'gradeChart');
tbl.setAttribute('border', '1');
tbl.style.margin = '20px 0px';
var tbdy = document.createElement('tbody');

tbl.appendChild(tbdy);
body.appendChild(tbl);
for (var i = 0; i < categories.length; i++) {
  $('#gradeChart > tbody:last-child').append('<tr id="'+ categories[i].name.replace(/[^a-z0-9]/gi, '') +'tr"><td style="padding: 5px;">' + categories[i].name + '</td><td style="padding: 5px;">' + categories[i].weight + '%</td></tr>');

    for (var k = 0; k < categories[i].grades.length; k++) {
      $('#gradeChart > tbody > tr:last-child').append('<td style="padding: 5px;"><input class="gradeInput' + categories[i].name.replace(/[^a-z0-9]/gi, '') + '" style="width:40px" value="' + categories[i].grades[k] + '"></td>')
      if(k == categories[i].grades.length-1) {
        //$('#gradeChart > tbody > tr:last-child').append('<td style="padding: 5px;"><input class="gradeInput' + categories[i].name.replace(/[^a-z0-9]/gi, '') + '" style="width:40px"></td>')
        $('#gradeChart > tbody > tr:last-child').append('<td style="padding: 5px;"><button class="plus" id="'+ categories[i].name.replace(/[^a-z0-9]/gi, '') +'">+</button></td>')

      }
    }
    if(categories[i].grades.length == 0) {
      $('#gradeChart > tbody > tr:last-child').append('<td style="padding: 5px;"><button class="plus" id="'+ categories[i].name.replace(/[^a-z0-9]/gi, '') +'">+</button></td>')
    }
}

$('#gradeChart').on("click", ".plus", function(){
  $('#'+ this.id +'tr td:last').before('<td style="padding: 5px;"><input class="gradeInput' + this.id + '" style="width:40px"></td>');
});

var but = document.createElement('button');
var text = document.createTextNode("Calculate");
but.setAttribute('id', 'calculateButton');
but.appendChild(text);
body.appendChild(but);

$('#calculateButton').click(function() {
  gradeTableToObject();
  $('#result2').remove();
  $('.content-block').append('<h2 id="result2">Grade: ' + Math.round(fresult() * 100) / 100 + '%</h2>')
});

function gradeTableToObject() {
  categories = [];
  $('#gradeChart tbody tr').each(function(i) {
    var cat = {};
    cat.name = $(this).children().first().text();
    cat.weight = Number($(this).children().eq(1).text().replace(/[^0-9]+/g, ""));
    cat.grades = getGrade1(cat.name)
    cat.avg = getAvg(cat.grades)
    cat.specialNum = cat.avg * cat.weight / 100;
    categories.push(cat);
  })
  //console.log(categories);
}

function getGrade1(name) {
  var grades = [];
  $('.gradeInput' + name.replace(/[^a-z0-9]/gi, '')).each(function(i) {
    if($(this).val() != '') {
      grades.push($(this).val())
    }
  })
  return grades;
}

});
