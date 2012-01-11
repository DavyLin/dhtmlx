========
Overview
========

*** NOTE The software in this repository is not yet ready for use and is in active development. Please click the Watch button above to be automatically kept up to date with progress. ***

This package provides the DHTMLX Standard Javascript libraries for use with Symfony2. The DHTMLX library itself is provided by DHTMLX Ltd at http://www.dhtmlx.com. This package is provided as a convenience and is intended to be used in conjunction with Cloud9DhtmlxBundle.

Features:

- DHTMLX v.3.0 Standard edition
- Powerful and flexible ui/server side data connectors
- Ajax gantt chart
- Ajax scheduler
- Ajax spreadsheet
- Ajax accordion ui control
- Simplified Ajax Get/Post handler
- Ajax calendar ui control
- Ajax charts
- Ajax color picker
- Ajax combo control
- Ajax data store
- Ajax data view control
- Ajax rich text editor
- Ajax form control
- Ajax grid control
- Window layout control
- Ajax menu system
- Ajax slider control
- Ajax tabbar control
- Ajax toolbar control
- Ajax tree control
- Ajax window/dialog control
- Ajax file vault

Installation
------------
Add the following to your ``deps`` file::

    [cloud9-dhtmlx]
        git=https://github.com/cloud9business/dhtmlx.git
        
Make sure that you register the namespaces with the autoloader::

    // app/autoload.php
    $loader->registerNamespaces(array(
        // ...
        'Cloud9\Dhtmlx'         => __DIR__.'/../vendor/cloud9-dhtmlx/src',
        // ...
    ));

Configuration
-------------

DHTMLX Usage
------------
See

http://docs.dhtmlx.com/doku.php

http://www.dhtmlx.com/docs/products/docsExplorer/samples.shtml      