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

function text_to_binary(ascii){
  var binary_array = []
  s_ascii = ascii.split('')
  for(char in s_ascii){
    char = s_ascii[char]
    char = char.charCodeAt(0)
    //console.log(char.charCodeAt(0))
    var bin = char.toString(2)
    bin = bin.split('')
    binary_array = binary_array.concat(bin)
  }
return binary_array
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

function modsine(freq, time, samp_freq, amplitude, phase, yshift, data, baud, deviation){
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

function simplesine(freq, time, samp_freq, amplitude, phase, yshift){
  var points = []
  for(t = 0; t < time; t += (1.0/samp_freq)){
    var x = t
    var z = t % 2
    var y = yshift + (amplitude * Math.sin(2 * Math.PI * (1/(freq)) * t + phase))
    console.log('(' + x + ',' + y + ')' + ' : ' + z)
    points.push([x,y])
  }
  console.log(points)
  return points
}

function generate(binary, y_offset, deviation, baud){
    document.getElementById('binary').innerText = binary
    console.log(binary)
    // calculate the cursor's movements
    // so the baud and deviation is a little agressive for the voltage, we knock it down a bit to get it in the same realm
    baud = baud / 2
    deviation = deviation * 100

    center = 250
    path_string = "M 0 " + y_offset + " "
    last_bit = 1
    for(bit in binary){
        bit = binary[bit]
        this_deviation = deviation
        if(last_bit == bit){
          this_deviation = 0
        }
        if(bit == 0){
          path_string = path_string + 'l 0 ' + (-1 * this_deviation).toString() + ' l ' + baud.toString() +' 0'
        }else{
          path_string = path_string + 'l 0 ' + (this_deviation).toString() + ' l ' + baud.toString() +' 0'
        }
        last_bit = bit
    }
    return path_string
    //var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);
    //paths are like movements of the cursor
    //path_string = path_string + ' z'
    console.log(path_string)
    //paper.path(path_string)
}

function drawSine(){
  var samples = parseFloat(document.getElementById('samps').value)

  var data = document.getElementById('data').value
  data = text_to_binary(data)

  var deviation = parseFloat(document.getElementById('deviation').value)
  var baud = parseInt(document.getElementById('baud').value)
  var yshift = parseInt(document.getElementById('yshift').value)
  var amplitude = parseInt(document.getElementById('amplitude').value)

  var time = parseInt(document.getElementById('time').value)
  document.getElementById('t_val').innerText = time

  var freq = parseInt(document.getElementById('freq').value)
  document.getElementById('t_freq').innerText = 1/freq

  //var period = document.getElementById('period').value
  var phase = parseInt(document.getElementById('phase').value)

  //var  = document.getElementById('')
  var modpoints = modsine(freq, time, samples, amplitude, phase, 300, data, baud, deviation)
  var carrierpoints = simplesine(freq, time, samples, amplitude, phase, 200)

  var voltage_graph = generate(data, 100, deviation, baud)

  //var points = retry(yshift, amplitude, freq,period)
  var paper = new Raphael(document.getElementById('canvas_container'), 1000, 400);

  console.log("")
  paper.path(voltage_graph)

  //plot that stuff
  for (var i=0; i<=(carrierpoints.length-1); i+= 1){
      paper.circle(carrierpoints[i][0],carrierpoints[i][1],1).attr('fill','red')
  }

  for (var i=0; i<=(modpoints.length-1); i+= 1){
      paper.circle(modpoints[i][0],modpoints[i][1],1).attr('fill','red')
  }
}
