window.onload = function() {
    var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);
    var tetronimo = paper.path("M 250 250 l 0 -50 l -50 0 l 0 -50 l -50 0 l 0 50 l -50 0 l 0 50 z");
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
function generate(){
    var ascii = document.getElementById('fskdata').value

    console.log(ascii)
    var binary = text_to_binary(ascii)
    document.getElementById('binary').innerText = binary
    console.log(binary)

    // calculate the cursor's movements
    baud = parseInt(document.getElementById('baud').value) //in pixels
    deviation = parseInt(document.getElementById('deviation').value) //in pixels
    center = 250
    path_string = "M 0 250 "
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
    var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);
    //paths are like movements of the cursor
    //path_string = path_string + ' z'
    console.log(path_string)
    paper.path(path_string)
}

//things to do:
// deviation, baudrate
