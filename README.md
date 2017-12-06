# WurmMapGen
Wurm Unlimited interactive tile map generator

## Installation
1. Download the latest release from the [releases page](https://github.com/woubuc/WurmMapGen/releases)
2. Unpack the downloaded archive
3. Adjust the settings in the included properties file
4. Run WurmMapGen.jar

### Master branch
When using this application in production, never directly use the code
from the master branch. Always use the downloads on the releases page
in the Github repository.

## Template
The `index.html` file will be loaded as a [mustache](https://mustache.github.io/mustache.5.html) template. The following template variables are available:

- `{{serverName}}` the name of the server
- `{{showDeeds}}` boolean, true if deeds are included on the map
- `{{showGuardTowers}}` boolean, true if guard towers are included on the map
- `{{showStructures}}` boolean, true if structures are included on the map

All of these values are configured in the properties file.

### Editing the template

Always make sure to edit the template in the `./template` directory next to the jar. Any output files will be overwritten by the application upon its next run.

## Development

### Releases
A release should contain the following three items:
- `WurmMapGen.jar`
- The properties file `WurmMapGen.properties`
- The `template` directory

When adding a release, create a tag in the repository, then generate a
release archive and upload it to the releases page.
