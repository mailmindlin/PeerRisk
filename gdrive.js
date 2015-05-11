gapi.load("auth:client,drive-realtime,drive-share", printmeWith('Realtime loaded!'));
var gcapi={
	getApi:function(name,version){return new Promise(function(yay,nay){gapi.client.load(name,version,yay);});},
	getFileMeta:function(args){return new Promise(function(yay){gcapi.getApi('drive','v2').then(function(){gapi.client.drive.files.get(args).execute(yay);})})},
	doGet:function(url,headers){return new Promise(function(yay,nay){var xhr=new XMLHttpRequest();xhr.open('GET',url);for(var header in headers)xhr.setRequestHeader(header,headers[header]);xhr.onload=function(){if(xhr.status == 200){yay(xhr.response)}else{nay(Error(req.statusText))}xhr=(xhr.onerror=xhr.onabort=xhr.ontimeout=xhr.onload=undefined);};xhr.onerror=xhr.onabort=xhr.ontimeout=nay;xhr.send();});},
	getFile:function(args){return new Promise(function(yay,nay){gcapi.getFileMeta(args).then(function(meta){gcapi.doGet(meta.downloadUrl,{'Authorization':'Bearer '+gapi.auth.getToken().access_token}).then(function(data){yay({meta:meta,data:data});},nay);});});},
	uploadBlob:function(folderid,name,blob) {
		const boundary='-------314159265358979323846',delimiter="\r\n--"+boundary+"\r\n",close_delim="\r\n--"+boundary+"--";
		return new Promise(function(yay,nay){
			var reader = new FileReader();reader.readAsBinaryString(blob);
			reader.onload = function(e) {
				var contentType = blob.type || 'application/octet-stream';
				var metadata = {title: name,mimeType: blob.type};

				var base64Data = btoa(reader.result);
				var multipartRequestBody=delimiter +'Content-Type: application/json\r\n\r\n' +
					JSON.stringify(metadata) +
					delimiter +
					'Content-Type: ' + contentType + '\r\n' +
					'Content-Transfer-Encoding: base64\r\n\r\n' +
					base64Data +
					close_delim;

				var request = gapi.client.request({
					'path': '/upload/drive/v2/files',
					'method': 'POST',
					'params': {'uploadType': 'multipart'},
					'headers': {
						'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
					},
					'body': multipartRequestBody});
				request.execute(yay);
			}
		});
	},
	uploadString:function(folderid,name,string,type) {return gcapi.uploadBlob(folderid,name,new Blob([string],{type:type}));},
	importPage:function(pagename) {
		$('head').append($('<link/>').attr('rel','import').attr('href','?htmlimport&page='+pagename).promise(printmeWith('Pageload!')));
	},
	realtime:function(initializer, loadfn, title) {
		var realtimeLoader = new rtclient.RealtimeLoader({
			clientId: CLIENT_ID,
			authButtonElementId:'na',
			initializeModel: initializer,
			autoCreate: true,
			defaultTitle: title,
			newFileMimeType: 'application/prisk.game',
			onFileLoaded: loadfn,
			registerTypes: null, // No action.
			afterAuth: printme // No action.
		});
		realtimeLoader.start();
		return realtimeLoader;
	}
};