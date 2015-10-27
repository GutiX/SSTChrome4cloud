SSTChrome4cloud (Synthesis service)
============

The Chrome extension for Google Chrome is a component installable in the web browser. This extension establishes a connection with GPII to get the active preferences. These preferences contain configuration parameters used, by the extension, to request to the synthesis service the adaptation of a web page. The extension sends the configuration parameters and the website URL to synthesis service. The synthesis service creates a new version of the web page using the URL and the configuration parameters received. Synthesis service returns to the chrome extension a new URL with the new version of the web page.
The Chrome extension can work autonomously, with cloud-based flowManager, or by local flowManager.

Installation
============

To install the chrome extension, make the following steps.

  * Download the zip file from https://github.com/GutiX/SSTChrome4cloud/archive/master.zip 
  * Extract the zip file in a folder of your choice
  * In the Chrome browser, click on the ‘settings’ icon in the upper right corner.
  * Once in the ‘settings’ page, go to ‘extensions’ in the left sidebar menu
  * Make sure the ‘Developer mode’ checkbox is checked
  * Then, click on ‘Load unpacked extension...’
  ** Select the folder where you unzipped the files you downloaded in step 2

License
=======

Copyright (c) 2013-2015, Technosite R&D / Ilunion. All rights reserved. This software is licensed under 
the [BSD 3-Clause License](http://opensource.org/licenses/BSD-3-Clause).

The research leading to these results has received funding from the European Union's Seventh Framework Programme (FP7/2007-2013) under grant agreement n° 289016. More about Cloud4all: http://cloud4all.info/.

