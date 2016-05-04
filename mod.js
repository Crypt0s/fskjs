// thanks, stack overflow: http://stackoverflow.com/questions/202605/repeat-string-javascript
function repeat(pattern, count) {
    if (count < 1) return '';
    var result = '';
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result + pattern;
}


function oversample(time, samp_freq, data){
  var baud = 10
  var transitions = time * baud
  // ok so we need to evenly push
  samp_freq = 1/samp_freq
  var samples = Math.ceil(time / samp_freq)

  // determine the ratio of transitions to samples and blammo
  var interp_ratio = Math.floor(samples / data.length)
  new_data = ''
  for(i=0;i<data.length;i++){
    new_data = new_data + repeat(data[i],interp_ratio)
  }

  //now we have an interpolated data array with the correct symbol for each sample in the sample-pile

  console.log("interp ratio: " + interp_ratio)
  console.log("transitions: " + transitions)
  console.log("samples: " + samples)

  return new_data.split('') //needs to be an array again
}

function simplesine(freq, time, samp_freq, amplitude, phase, yshift, data){
  var deviation = .04
  var points = []
  samples_to_send = oversample(time,samp_freq,data)
  mod_i = 0

  for(t = 0; t < time; t += (1.0/samp_freq)){
    var x = t

    //determine if we are about to send a zero or a one and set deviation accordingly to positive or negitive
    if(samples_to_send[mod_i] == '0'){
      var dev = -1 * deviation
    }else{
      var dev = deviation
    }

    var y = yshift + (amplitude * Math.sin(2 * Math.PI * ((1/freq) + dev) * t + phase))
    //console.log('(' + x + ',' + y + ')' + ' : ' + z)
    points.push([x,y])
    mod_i += 1
  }
  console.log("points: " + points.length)
  return points
}
function drawSine(){
  var samples = parseFloat(document.getElementById('samps').value)
  var data = document.getElementById('data').value.split('')

  var yshift = parseInt(document.getElementById('yshift').value)
  var amplitude = parseInt(document.getElementById('amplitude').value)

  var time = parseInt(document.getElementById('time').value)
  document.getElementById('t_val').innerText = time

  var freq = parseInt(document.getElementById('freq').value)
  document.getElementById('t_freq').innerText = 1/freq
  //var period = document.getElementById('period').value

  var phase = parseInt(document.getElementById('phase').value)

  //var  = document.getElementById('')
  var points = simplesine(freq, time, samples, amplitude, phase, yshift, data)
  //var points = retry(yshift, amplitude, freq,period)
  var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);

  //plot that stuff
  for (i=0; i<=(points.length-1); i+= 1){
      paper.circle(points[i][0],points[i][1],2).attr('fill','red')
  }
}
