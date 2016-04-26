function toDegrees(x){
  x = x * (180/Math.PI)
  return x
}

function toRadians(x){
  x = (Math.PI/180) * x
  return x
}


/*
Considerations:

number of samples the frequency needs to be shifted must match baud rate (time) for each symbol
baud = symbols/second

we could make our lives much easier and say that we will lock baud to sample rate BUT
This doesn't change that we need to keep freq. shifted as we move through the symbol

the easiest would be to lock frequency to baud and sampling rate to frequency * 2
no, because we would still need to track state across the 2 samples == better to have a function generate the required frequency deviation based on time!!!

aha ok so we will simply build a t-based function which outputs deviations to freq value at set intervals!


here is GNURadio's implementation of a Frequency Modulator:
      for(int i = 0; i < noutput_items; i++) {
        d_phase = d_phase + d_sensitivity * in[i];

        //place phase in [-pi, +pi[
        #define F_PI ((float)(M_PI))
        d_phase   = std::fmod(d_phase + F_PI, 2.0f * F_PI) - F_PI;

        float oi, oq;

        int32_t angle = gr::fxpt::float_to_fixed (d_phase);
        gr::fxpt::sincos(angle, &oq, &oi);
        out[i] = gr_complex(oi, oq);
      }

      return noutput_items;



*/





function modsine(freq, time, samp_freq, amplitude, phase, yshift){
  freq = 2 * 100
  time = 5
  samp_freq = 100
  amplitude = 50
  phase = 0
  yshift = 200
  
  var points = []
  for(t = 0; t < time; t += (1.0/samp_freq)){
    var x = t

    //insert time-modulo code here to deviate frequency every X time period

    var y = yshift + (amplitude * Math.sin(2 * Math.PI * (1/(freq*b)) * t + phase))
    points.push([x,y])
  }
  console.log(points.length)
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


function drawSine(){
  var samples = parseFloat(document.getElementById('samps').value)
  var yshift = parseInt(document.getElementById('yshift').value)
  var amplitude = parseInt(document.getElementById('amplitude').value)

  var time = parseInt(document.getElementById('time').value)
  document.getElementById('t_val').innerText = time

  var freq = parseInt(document.getElementById('freq').value)
  document.getElementById('t_freq').innerText = 1/freq
  //var period = document.getElementById('period').value

  var phase = parseInt(document.getElementById('phase').value)

  //var  = document.getElementById('')
  var points = simplesine(freq, time, samples, amplitude, phase, yshift)
  //var points = retry(yshift, amplitude, freq,period)
  var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);

  //plot that stuff
  for (i=0; i<=(points.length-1); i+= 1){
      paper.circle(points[i][0],points[i][1],2).attr('fill','red')
  }
}
