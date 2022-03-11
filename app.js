var http = require("http");
var fs = require("fs");
var qs = require("querystring");
var vehiclePlates = JSON.parse(
  fs.readFileSync(__dirname + "/vehicle_plates.json")
);
var idx = 1;
vehiclePlates.forEach((vp) => {
  vp.id = idx++;
});

http
  .createServer(function (req, res) {
    if (req.url === "/" || req.url === "/bt.html") {
      
      res.writeHead(200, { "Content-Type": "text/html" });

      fs.createReadStream(__dirname + "/bt.html").pipe(res);
    } else if (req.url === "/api/vehicle_plates/cities") {
      
      console.log("request to cities");

      var cities = [];
      vehiclePlates.forEach((vp) => {
        cities.push({ id: vp.id, text: vp.city });
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(cities));
      res.end();
    } else if (req.url === "/api/vehicle_plates/findCityPlate") {
      
      console.log("request to city plate");
      var result = "";
      var body = "";
      var params = "";

      req
        .on("data", function (data) {
          
          body += data;
        })
        .on("end", function (data) {
          params = qs.parse(body);
          vehiclePlates.forEach((vp) => {
            if (vp.id == params.id) {
              console.log("found");
              result = vp.plate_no;
              return false;
            }
          });
          res.end(result);
        });
    } else {
      
      res.writeHead(404, { "Content-Type": "text/plain-text" });
      res.end("Not found the page you requested.");
    }
  })
  .listen(3000);

console.log("Listening on port 3000... ");