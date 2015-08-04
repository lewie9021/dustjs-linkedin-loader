var Path = require("path");
var Dust = require("dustjs-linkedin");
var LoaderUtils = require("loader-utils");

module.exports = function(content) {
    var relativePath, templateName;
    var query = LoaderUtils.parseQuery(this.query);
    var paths = [];
    
    this.cacheable && this.cacheable();
    
    if (query.path) 
        paths.push(query.path);

    if (query.paths)
        paths.push.apply(paths, query.paths);
    
    paths.push(this.options.context);

    // We want to loop through each path and see if it matches part of the file path.
    for (var i = 0; i < paths.length; i ++) {
        var path = paths[i];
        
        if (this.resourcePath.indexOf(path) == 0) {
            relativePath = this.resourcePath.replace(path + Path.sep, "");
            break;
        }
    }

    // If the path includes slashes or spaces, replace them with hyphens.
    templateName = relativePath.replace(".dust", "").replace(/[/\\\s]/g, "-");

    return [
        // The output of the compile function requires that the variable 'dust' exists. Without a module system, 'dust'
        // would exist on the window, making it a global variable.
        "var dust = require('dustjs-linkedin');\n",

        // Compile the template returning an stringified IIFE registering the template under the name in 'templateName'.
        Dust.compile(content, templateName) + "\n",
        
        // Return the template name to make the require statement more meaningful.
        "module.exports = '" + templateName + "';"
    ].join("");
};
