function toDegrees(x){
  x = x * (180/Math.PI)
  return x
}

function toRadians(x){
  x = (Math.PI/180) * x
  return x
}
/*
function simplesine(time, samples, frequency, amplitude, yshift){
  var iterations = time
  var points = []

  for(i=0;i<iterations;i+=1){
    var x = i
    var y = amplitude * (Math.sin(i))
    y = y + yshift
    points.push([x,y])
  }
  return points
}
*/

function simplesine(freq, time, samples){
  var iterations = time
  var points = []
  var sps = time / time
  for(i=0;i<time;i+=sps){
    var x = i
    var y = 50 * (Math.sin(toRadians(freq * i)))
    console.log('(' + x + ', ' + y + ')')
    y = y + 200
    points.push([x,y])
  }
  console.log(points.length)
  return points
}


function drawSine(){
  var samples = parseInt(document.getElementById('samps').value)
  var yshift = parseInt(document.getElementById('yshift').value)
  var amplitude = parseInt(document.getElementById('amplitude').value)
  var time = parseInt(document.getElementById('time').value)
  var freq = parseInt(document.getElementById('freq').value)
  //var period = document.getElementById('period').value

  //var  = document.getElementById('')
  var points = simplesine(freq, time, samples)
  //var points = retry(yshift, amplitude, freq,period)
  var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);

  //plot that stuff
  for (i=0; i<=(points.length-1); i+= 1){
      paper.circle(points[i][0],points[i][1],5).attr('fill','red')
  }
}
