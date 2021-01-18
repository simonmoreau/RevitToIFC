**This project is now archived, you can find the new version in [RevitToIFCApp](https://github.com/simonmoreau/RevitToIFCApp)**

----


<p align="center"><img width=12.5% src="https://raw.githubusercontent.com/simonmoreau/RevitToIFC/master/src/images/revitToIFC_logo.png"></p>
<h1 align="center">
  RevitToIFC
</h1>

<h4 align="center">A Web App to convert Revit files to IFC</h4>

# Overview

Revit To IFC is a web application using the Autodesk Forge web services to convert Revit file to the IFC format. You can use this application to upload your Revit file to the Forge service and download back the converted file.

![Overview](https://raw.githubusercontent.com/simonmoreau/RevitToIFC/master/doc/revitToIfc.gif)

# Installation

*Prerequisite*:

* Please install Angular-CLI by following [these instructions](https://github.com/angular/angular-cli#installation).
* Create a new application on the [Autodesk Forge website](https://developer.autodesk.com/myapps/create). This app must include the Data Management API and the Model Derivative API

```bash
git clone https://github.com/simonmoreau/RevitToIFC.git
cd RevitToIFC

# install the project's dependencies
npm install

# starts the application in dev mode and watches your files for livereload
ng serve
```

For comprehensive documentation on Angular-CLI, please see their [github repository](https://github.com/angular/angular-cli).

This Web app use [Azure Function](https://azure.microsoft.com/en-us/services/functions/) to retrieve a Forge access token. You can find this function [here](https://github.com/simonmoreau/ForgeFunction).

# Built With

* [Angular](https://angular.io)
* [Autodesk Forge](https://forge.autodesk.com/) - A web service used to convert Revit file to IFC

# Development

Want to contribute? Great, I would be happy to integrate your improvements!

To fix a bug or enhance an existing module, follow these steps:

* Fork the repo
* Create a new branch (`git checkout -b improve-feature`)
* Make the appropriate changes in the files
* Add changes to reflect the changes made
* Commit your changes (`git commit -am 'Improve feature'`)
* Push to the branch (`git push origin improve-feature`)
* Create a Pull Request

## Bug / Feature Request

If you find a bug (connection issue, error while uploading, ...), kindly open an issue [here](https://github.com/simonmoreau/RevitToIFC/issues/new) by including a screenshot of your problem and the expected result.

If you'd like to request a new function, feel free to do so by opening an issue [here](https://github.com/simonmoreau/RevitToIFC/issues/new). Please include workflows samples and their corresponding results.

# License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

# Contact information

This software is an open-source project mostly maintained by myself, Simon Moreau. If you have any questions or request, feel free to contact me at [simon@bim42.com](mailto:simon@bim42.com) or on Twitter [@bim42](https://twitter.com/bim42?lang=en).
