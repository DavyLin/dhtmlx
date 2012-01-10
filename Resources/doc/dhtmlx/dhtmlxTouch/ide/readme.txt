How to install
--------------

### VisualStudio 2010, VisualStudio 2008

- copy touchui.debug.js in the same folder where touchui.js located

### PHPStorm, WebStorm (JetBrain IDEs)

- drop touchui.sdoc.js in the project
- you may need to restart IDE after that to force auto-complete reindexing. 

### NetBeans 7

- drop touchui.sdoc in the project
- select in top menu "Source|Scan for external changes"

### Aptana 3.x

- drop touchui.vsdoc.js in the project
- restart IDE


### Eclipse

- install Eclipse JavaScript Development Tools
- go to project properties – JavaScript – Include Path
- click "Add JavaScript Library" – "User Library" – "Configure User Library" – "New"
- enter "touchui" as library name
- select touchui from the list and press "Add .js file", select touchui.sdoc.js 
  from the download package
- press "OK" and "Finish" in all dialogs

### Komodo IDE and Komodo Editor

- extract touchui.sdoc.js from the package to some folder
- open project properties – Languages – Javascript
- add the above folder to the list of JavaScript directories