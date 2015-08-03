var Path = require("path");
var Dust = require("dustjs-linkedin");
var LoaderUtils = require("loader-utils");

module.exports = function(content) {
    var query, paths, relativePath, templateName;
    
    this.cacheable && this.cacheable();
    
    query = LoaderUtils.parseQuery(this.query);
    paths = (query.paths || []).concat([this.options.context]);

    // We want to loop through each path and see if it matches part of the file path.
    for (var i = 0; i < paths.length; i ++) {
        var path = paths[i];
        
        if (this.resourcePath.indexOf(path) > -1) {
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
