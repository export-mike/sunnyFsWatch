var watch = require('watch'),
	sunnyConfig = require('./sunnyFileWatcher.json'),
	fs = require('fs');

watch.createMonitor(sunnyConfig.folderSource, function(monitor) {

	monitor.on("created", function(filePath, fileData) {
		console.log('new File created ' + filePath);

		copyFileToOutputFolder(filePath);
	});

	monitor.on("changed", function(filePath, currentFileData, previousFileData) {
		console.log('file changed ' + filePath);
		
		copyFileToOutputFolder(filePath);
	});

	monitor.on("removed", function(filePath, fileData) {
		console.log('file removed ' + filePath);

		removeFile(filePath);
	});
});

function filter(filePath) {
	var extension = sunnyConfig.watchOnlyExtension;

	return filePath.substr(filePath.length - extension.length) === extension;
}

function copyFileToOutputFolder(filePath) {
	fs.createReadStream(filePath).pipe(fs.createWriteStream(sunnyConfig.folderDestination + '/' + getFileName(filePath)));
}

function getFileName(filePath) {
	var splitChar = getSlashCharacter(filePath);
	var filePathParts = filePath.split(splitChar);

	return filePathParts[filePathParts.length - 1];
}

function getSlashCharacter (filePath) {
	if (filePath.indexOf('\\') != -1){
		return '\\';
	}
	else if(filePath.indexOf('/') != -1){
		return '/';
	}else{
		return '';
	}
}

function removeFile(filePath) {
	var outputFilePath = sunnyConfig.folderDestination + '/' + getFileName(filePath);
	fs.unlink(outputFilePath, function(err) {

		if (err) {
			throw err;
		}

		console.log('removed file:' + outputFilePath);
	});
}