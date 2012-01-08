========
Overview
========

This package provides server side integration of the DHTMLX Standard Javascript libraries..

Features:

- Powerful and flexible data connectors
- Ajax spreadsheet
- Vault

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