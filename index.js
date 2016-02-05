var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;

var base = process.cwd();

fs.readFile(path.resolve(base, "package.json"), "utf8", function(err, json) {
  if (err) {
    return console.log(err);
  }

  try {
    json = JSON.parse(json);
  } catch(e) {
    return console.log("package.json not valid");
  }

  var dependencies = json.dependencies;
  var devDependencies = json.devDependencies;

  var together = json.together;

  for (var name in together) {
    if (together.hasOwnProperty(name)) {
      var app = together[name];

      if (app.dependencies === true) {
        app.dependencies = dependencies;
      } else if (app.dependencies instanceof Array) {
        app.dependencies = fill(dependencies, app.dependencies, "--save");
      } else {
        app.dependencies = {};
      }

      if (app.devDependencies === true) {
        app.devDependencies = devDependencies;
      } else if (app.devDependencies instanceof Array) {
        app.devDependencies = fill(devDependencies, app.devDependencies, "--save-dev");
      } else {
        app.devDependencies = {};
      }

      var p = path.resolve(base, name + "/package.json");
      fs.writeFile(p, JSON.stringify(app, null, 2), function(err) {
        if (err) {
          return console.log(err);
        }

        exec("npm install", {
          cwd: path.resolve(base, name)
        }, function(err, stdout, stderr) {
          if (err) {
            return console.log(err);
          }
          console.log(stdout);
          console.log(stderr);
        });
      });
    }
  }
});

// TODO: use flag for install not specified npm deps
function fill(alldeps, appdeps, flag) {
  var result = {};

  appdeps.forEach(function(dep) {
    if (!alldeps.hasOwnProperty(dep)) {
      var splited = dep.split("@");
      if (splited.length === 2) {
        result[splited[0]] = splited[1];
      } else {
        // console.log("Warning: do `npm install " + dep + " " + flag + "` but it not specified in main package.json deps");
        throw new Error("Dependency " + dep + " not specified in package.json dependencies");
      }
    } else {
      result[dep] = alldeps[dep];
    }
  });

  return result;
}