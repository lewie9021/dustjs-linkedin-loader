# DustJS (LinkedIn) Loader

---

A loader for Webpack that compiles Dust templates into JavaScript to be used within the browser.

### Motivation

I initially looked at the default Dust loader [here](https://github.com/avaly/dust-loader), but unfortunatly it didn't meet my requirements. I wanted a simple way to control how templates were named and required. In the old loader, requiring templates didn't have much of a purpose. Instead I decided to both register the template and then return the name. This made the require more meaningful as it could be assigned to a variable and used with dust.render.

### Example

Below is a simple Webpack configuration (webpack.config.js).

```javascript
var Path = require("path");

module.exports = {
    entry: "./main.js",
    output: {
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            test: /\.dust$/,
            loader: "dust",
            query: {
                // Absolute path to the views directory.
                path: Path.join(__dirname,  "views")
            }
        }]
    }
};
```

The path query property is important as it effects the naming of the template. With the current configuration "./views/example.dust" would resolve to "example". However, if the path property wasn't given, it would instead resolve to "views-example". 

**Note**

If you wish to use multiple paths, you can instead use the 'paths' property. The loader will iterate through the list of paths (including the context path) and find the closest match.

Next we will create the template (views/example.dust).

```
Hello, {name}!
```

Lastly, we need to require the template.

```javascript
var Dust = require("dustjs-linkedin");
var template = require("./views/example.dust");

Dust.render(template, {name: "Lewis Barnes"}, function(err, result) {
    // result = "Hello Lewis Barnes!"
});
```

### Options

You can pass options to the loader using the query object or directly within the loader string. By default, the path used by the loader to determine the name of the templates is 'this.options.context. More information [here](http://webpack.github.io/docs/loaders.html).

#### Path (String)

This option allows you specify an absolute path to a directory (usually containing all your Dust templates). The loader will use this path to determine the name when registering your template.

#### Paths (Array)

Similar to the 'path' option, this instead allows you to specify an array of absolute paths to a number of directories (again, usually where your Dust templates are kept). The loader will iterate through the paths provided and find the closest match.
