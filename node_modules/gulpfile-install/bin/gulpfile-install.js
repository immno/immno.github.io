#!/usr/bin/env node

var command = require('commander')
var saveOption = ''
var gulpfile = 'gulpfile.js'

// TODO: Optimize regex to match only one group
// Matches both 'require(..)' and what's inside parenthesis
var regex = /require\((?:'|")(.*?)(?:'|")\)/g

command
  .usage('<file …> [options]')
  .option('-f, --file <path>', 'Set input gulpfile', setGulpfile)
  .option('-S, --save', 'Save modules as dependency')
  .option('-D, --save-dev', 'Save modules as dev dependency')
  .parse(process.argv)

function setGulpfile(file) {
  gulpfile = file
}

if(command.save) {
  saveOption = '--save'
}
else if(command.saveDev) {
  saveOption = '--save-dev'
}

// Read gulpfile
require('fs').readFile(gulpfile , 'utf8', function(err, data){
  var modules = []

  // Find all instances of require('…')
  while(match = regex.exec(data)){

    // Add module if it's not the the global registry
    try {
      require(match[1])
    }
    catch (error) {
      if(error.code === 'MODULE_NOT_FOUND') {
        modules.push(match[1])
      }
    }
  }

  // Loop through the modules and create install commands
  var installCommands = modules.map(function(module){
    return 'npm install ' + saveOption + ' ' + module + ';'
  }).join('')

  console.log('\n\nInstalling modules: \n\t' + modules.join('\n\t') + '\n\n')

  require('child_process').exec(installCommands).stderr.pipe(process.stderr)
})
