/*

+-----------------------------------------------------------------+
|     Created by Chirag Mehta - http://chir.ag/projects/ntc       |
|-----------------------------------------------------------------|
|               ntc js (Name that Color JavaScript)               |
+-----------------------------------------------------------------+

All the functions, code, lists etc. have been written specifically
for the Name that Color JavaScript by Chirag Mehta unless otherwise
specified.

This script is released under the: Creative Commons License:
Attribution 2.5 http://creativecommons.org/licenses/by/2.5/

Sample Usage:

  <script type="text/javascript" src="ntc.js"></script>

  <script type="text/javascript">

    var n_match  = ntc.name("#6195ED");
    n_rgb        = n_match[0]; // This is the RGB value of the closest matching color
    n_name       = n_match[1]; // This is the text string for the name of the match
    n_exactmatch = n_match[2]; // True if exact color match, False if close-match

    alert(n_match);

  </script>

*/

var names = require('./names');

class Ntc {

  constructor() {

    var color, rgb, hsl;

    this.names = names;

    for(var i = 0; i < this.names.length; i++)
    {
      color = "#" + this.names[i][0];
      rgb = this.rgb(color);
      hsl = this.hsl(color);
      this.names[i].push(rgb[0], rgb[1], rgb[2], hsl[0], hsl[1], hsl[2]);
    }
  }

  name(color) {

    color = color.toUpperCase();
    if(color.length < 3 || color.length > 7)
      return ["#000000", "Invalid Color: " + color, false];
    if(color.length % 3 == 0)
      color = "#" + color;
    if(color.length == 4)
      color = "#" + color.substr(1, 1) + color.substr(1, 1) + color.substr(2, 1) + color.substr(2, 1) + color.substr(3, 1) + color.substr(3, 1);

    var rgb = this.rgb(color);
    var r = rgb[0], g = rgb[1], b = rgb[2];
    var hsl = this.hsl(color);
    var h = hsl[0], s = hsl[1], l = hsl[2];
    var ndf1 = 0, ndf2 = 0, ndf = 0;
    var cl = -1, df = -1;

    for(var i = 0; i < this.names.length; i++)
    {
      if(color == "#" + this.names[i][0])
        return ["#" + this.names[i][0], this.names[i][1], true];

      ndf1 = Math.pow(r - this.names[i][2], 2) + Math.pow(g - this.names[i][3], 2) + Math.pow(b - this.names[i][4], 2);
      ndf2 = Math.pow(h - this.names[i][5], 2) + Math.pow(s - this.names[i][6], 2) + Math.pow(l - this.names[i][7], 2);
      ndf = ndf1 + ndf2 * 2;
      if(df < 0 || df > ndf)
      {
        df = ndf;
        cl = i;
      }
    }

    return (cl < 0 ? ["#000000", "Invalid Color: " + color, false] : ["#" + this.names[cl][0], this.names[cl][1], false]);
  }

  // adopted from: Farbtastic 1.2
  // http://acko.net/dev/farbtastic
  hsl(color) {

    var rgb = [parseInt('0x' + color.substring(1, 3)) / 255, parseInt('0x' + color.substring(3, 5)) / 255, parseInt('0x' + color.substring(5, 7)) / 255];
    var min, max, delta, h, s, l;
    var r = rgb[0], g = rgb[1], b = rgb[2];

    min = Math.min(r, Math.min(g, b));
    max = Math.max(r, Math.max(g, b));
    delta = max - min;
    l = (min + max) / 2;

    s = 0;
    if(l > 0 && l < 1)
      s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));

    h = 0;
    if(delta > 0)
    {
      if (max == r && max != g) h += (g - b) / delta;
      if (max == g && max != b) h += (2 + (b - r) / delta);
      if (max == b && max != r) h += (4 + (r - g) / delta);
      h /= 6;
    }
    return [parseInt(h * 255), parseInt(s * 255), parseInt(l * 255)];
  }

  // adopted from: Farbtastic 1.2
  // http://acko.net/dev/farbtastic
  rgb(color) {
    return [parseInt('0x' + color.substring(1, 3)), parseInt('0x' + color.substring(3, 5)),  parseInt('0x' + color.substring(5, 7))];
  }

}

module.exports = new Ntc();