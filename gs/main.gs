var cdn='https://rawgit.com/mailmindlin/PeerRisk/master/';//'https://cdn.rawgit.com/mailmindlin/PeerRisk/master/';
/**
 * Serves HTML of the application for HTTP GET requests.
 * If folderId is provided as a URL parameter, the web app will list
 * the contents of that folder (if permissions allow). Otherwise
 * the web app will list the contents of the root folder.
 *
 * @param {Object} e event parameter that can contain information
 *     about any URL parameters provided.
 */
function doGet(e) {
	if(e.parameter.htmlimport && e.parameter.page) {
		if(['serverlist'].indexOf(e.parameter.page)>-1)
			return HtmlService.createHtmlOutputFromFile(page).getContent();
	}
	if(e.parameter.page)
		switch(e.parameter.page) {
			case 'privacy': {//show privacy policy
				var template=HtmlService.createTemplateFromFile('privacy');
				template.userid=Session.getActiveUser().getEmail();
				return template.evaluate()
					.setTitle('PeerRist | Privacy')
					.setSandboxMode(HtmlService.SandboxMode.IFRAME);
			}
		}
	var template = HtmlService.createTemplateFromFile('Index');

	// Retrieve and process any URL parameters, as necessary.
	if (e.parameter.folderId) {
		template.folderId = e.parameter.folderId;
	} else {
		template.folderId = 'root';
	}
	var sdata={esrc:JSON.stringify(e)};
	if(e.parameter.state) {
		e.parameter.state=JSON.parse(e.parameter.state.replace(/=/g,','));
		sdata.action=e.parameter.state.action;
		if(e.parameter.state && e.parameter.state.action=='open') {
			sdata.fileids=JSON.stringify(e.parameter.state.ids);
			sdata.userid=e.parameter.state.userId;
		} else if(e.parameter.state.action=='create') {
			sdata.fileids=e.parameter.state.folderId;
			sdata.userid=e.parameter.state.userId;
		} else {
			template.userid=Session.getActiveUser().getEmail();
		}
	}
	template.sdata=JSON.stringify(sdata);
	// Build and return HTML in IFRAME sandbox mode.
	return template.evaluate()
		.setTitle('PeerRisk')
		.setSandboxMode(HtmlService.SandboxMode.IFRAME);
}
function doPost(e) {
  return JSON.stringify({"message":'NYI'}); 
}
/**
 * Return an array of up to 20 filenames contained in the
 * folder previously specified (or the root folder by default).
 *
 * @param {String} folderId String ID of folder whose contents
 *     are to be retrieved; if this is 'root', the
 *     root folder is used.
 * @return {Object} list of content filenames, along with
 *     the root folder name.
 */
function getFolderContents(folderId) {
	var topFolder;
	var contents = {
		children: []
	};

	if (folderId == 'root') {
		topFolder = DriveApp.getRootFolder();
	} else {
		// May throw exception if the folderId is invalid or app
		// doesn't have permission to access.
		topFolder = DriveApp.getFolderById(folderId);
	}
	contents.rootName = topFolder.getName() + '/';

	var files = topFolder.getFiles();
	var numFiles = 0;
	while (files.hasNext() && numFiles < 20) {
	 var file = files.next();
	 contents.children.push(file.getName());
	 numFiles++;
	}

	return contents;
}
function include(path,async,defer) {
	if(Array.isArray(path)) {
		var result='';
		path.forEach(function(k){result+=include(k,async);});
		return result;
	}else {
		if(path.indexOf('.js')==path.length-3) {
			return "<script src='"+cdn+path+"' "+ (async?'async ':'') + (defer?'defer':'') +'></script>';// +" onload='console.log(\"Script "+path+" loaded...\")' onerror='console.error(\"Error w/ script "+path+"!\")'></script>";
		}else if(path.indexOf('.css')==path.length-4)
			return "<link rel='stylesheet' href='"+cdn+path+"'/>";
		else
			return "<link rel='import' href='"+cdn+path+"'/>";
	}
}
function onOpen(e) {
	
}