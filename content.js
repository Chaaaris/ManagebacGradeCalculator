jQuery(document).ready(function() {console.log("ready");

var categories = [];

$('.labels-set .label-group:nth-child(2)').remove()

$('.table-condensed tbody tr').each(function(i) {
  var cat = {}
  cat.name = $(this).children().first().text();
  cat.weight = Number($(this).find('.text-right').text().replace(/[^0-9]+/g, ""));
  cat.avg = getGradeAvg(cat.name)
  cat.specialNum = cat.avg * cat.weight / 100;
  categories.push(cat)
})

function getGradeAvg(cat) {
  var grades = [];
  $('.label-score').each(function(i) {
    if(cat.indexOf($(this).parent().parent().children().eq(2).text()) > -1) {
      var a = $(this).text();
      var b = a.split('/').map(function(item) {
        return parseInt(item, 10);
      });
      grades.push(b[0] / b[1] * 100);
    }
  })
  var sum = 0;
  for(var i = 0; i < grades.length; i++) {
    sum += parseInt(grades[i], 10);
  }
  return sum/grades.length;s
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
  console.log(sumWeight);
  console.log(sumSpecial);
  return sumSpecial / sumWeight * 100;
}

console.log(fresult());
console.log(categories);

})
