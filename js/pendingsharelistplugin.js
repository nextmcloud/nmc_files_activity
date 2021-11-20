(function() {
	var FilesPlugin = {
		attach: function(fileList) {
			this.fileList = fileList;
			// Only register this plugin on the initial file list
			if (fileList.id !== 'files') {
				return;
			}

			var pendingShares = {
				url: OC.linkToOCS('apps/files_sharing/api/v1/shares', 2) + 'pending',
				/* jshint camelcase: false */
				data: {
					format: 'json'
				},
				type: 'GET',
				beforeSend: function(xhr) {
					xhr.setRequestHeader('OCS-APIREQUEST', 'true')
				}
			}

			var self = this;

			var pendingShareHeader = $('<tbody id="fileList" class="pendingSharesList"></tbody>');
			pendingShareHeader.insertBefore(fileList.$el.find('tbody'))

			$.ajax(pendingShares).then(function(data) {
				var pendingShareList = data.ocs.data;
				pendingShareList.forEach(function(share) {
					pendingShareHeader.append(self.renderPendingShareRow(share))
				});
			});

		},

		renderPendingShareRow: function(share) {
			var self = this;
			var $tr = $('<tr class="pending-share-row"></tr>');
			$tr.attr({
				"data-id" : share.file_source,
				"data-size": share.size,
				"data-file": share.path,
				"data-mime": share.mimetype,
				"data-mtime": share.stime,
				"data-permissions": 8,
				"data-has-preview": share.hasPreview,
				//"data-mounttype": 'shared-root',
				"data-share-id": share.id,
				"data-share-owner": share.displayname_file_owner,
				"data-share-permissions": share.permissions,
				"data-share-owner-id": share.uid_file_owner
			});
			// TODO: Add icon with OC.MimeType.getIconUrl(mimetype)

			var	td = $('<td class="selection"><input id="select-files-'+ share.id +'" type="checkbox" class="selectCheckBox checkbox" disabled><label for="select-files-'+ share.id +'"><span class="hidden-visually">Select</span></label></td>');

			$tr.append(td);
			td = $('<td class="filename"></td>');
			var linkElem = $('<a></a>').attr({
				"class": "name",
			});

			var nameSpan=$('<span></span>').addClass('nametext');
			var fileName = share.path.split('.');
			var innernameSpan = $('<span></span>').addClass('innernametext').text(fileName[0]);
			var extensionSpan = $('<span></span>').addClass('extension').text('.'+fileName[1]);
			nameSpan.append(innernameSpan);
			nameSpan.append(extensionSpan);
			icon = this._getIconUrl(share);
			linkElem.append('<div class="thumbnail-wrapper"><div class="thumbnail" style="background-image: url(' + icon + ');"></div></div>');
		 	linkElem.append(nameSpan);
			var templateAcceptShare = '<a class="action-button accept-pending-share accept share permanent action-accept" href="#"><span class="icon icon-approve-share-blue"></span><span class="button-label">' + t('files_sharing', 'Accept') + '</span></a>';
			var templateRejectShare = '<a class="action-button reject-pending-share reject share permanent action-reject" href="#"><span class="icon icon-reject-share-blue"></span><span class="button-label">' + t('files_sharing', 'Reject') + '</span></a>';
			var templateShare = '<a class="action action-share permanent shared-style" href="#" data-action="Share" data-original-title="Shared by '+ share.displayname_file_owner +'" title="Shared by '+ share.displayname_file_owner +'"><span class="avatar" data-username="'+share.uid_owner+'" title="Shared by '+ share.displayname_file_owner +'" style="height: 32px; width: 32px;" data-original-title="Shared by '+ share.displayname_file_owner +'"><img title = '+ share.displayname_file_owner +' width="32" height="32" src="/index.php/avatar/test/32" alt=""></span><span class="receiveData">' + t('files_sharing', 'Received') + '</span>  </a>';
			var templateActions = '<span class="fileactions">' + templateAcceptShare + templateRejectShare + templateShare+'</span>';

		 	var $actions = $(templateActions);
			$actions.find('.avatar').tooltip();

		 	$actions.on('click', '.accept-pending-share', function(e) {
			 // TODO: implement accepting
			 $.post(OC.linkToOCS('apps/files_sharing/api/v1/shares/pending', 2) + share.id)
							.success(function(result) {
								self.fileList.reload();
								$('.pending-share-row[data-share-id="'+share.id+'"]').remove();
							}).fail(function() {
							OC.Notification.showTemporary(t('files_sharing', 'Something happened. Unable to accept the share.'))
						})
		 	});
		 	$actions.on('click', '.reject-pending-share', function(e) {
			 // TODO: implement rejecting
			 var shareBase = 'shares';
			 $.ajax({
				url: OC.linkToOCS('apps/files_sharing/api/v1/' + shareBase, 2) + share.id,
				type: 'DELETE'
			  }).success(function (result) {
					self.fileList.reload();
					$('.pending-share-row[data-share-id="'+share.id+'"]').remove();
			  }).fail(function () {
				OC.Notification.showTemporary(t('files_sharing', 'Something happened. Unable to reject the share.'));
			  });
		 	});

		 	linkElem.append($actions);
		 	td.append(linkElem);
		 	$tr.append(td);

		 	var isDarkTheme = OCA.Accessibility && OCA.Accessibility.theme === 'dark'

		 	try {
			  	var maxContrastHex = window.getComputedStyle(document.documentElement)
				 .getPropertyValue('--color-text-maxcontrast').trim()
			 	if (maxContrastHex.length < 4) {
				 	throw Error();
			 	}
			 	var maxContrast = parseInt(maxContrastHex.substring(1, 3), 16)
		 	} catch(error) {
			 	var maxContrast = isDarkTheme ? 130 : 118
		  	}

		  // size column
			if (typeof(share.size) !== 'undefined' && share.size >= 0) {
				simpleSize = OC.Util.humanFileSize(parseInt(share.size, 10), true);
				sizeColor = Math.round(118-Math.pow((share.size/(1024*1024)), 2));

				if (sizeColor >= maxContrast) {
					sizeColor = maxContrast;
			 	}

				if (isDarkTheme) {
					sizeColor = Math.abs(sizeColor);
					if (sizeColor < maxContrast) {
						sizeColor = maxContrast;
					}
			 	}
			} else {
				simpleSize = t('files', 'Pending');
			}

			td = $('<td></td>').attr({
				"class": "filesize",
				"style": 'color:rgb(' + sizeColor + ',' + sizeColor + ',' + sizeColor + ')'
			}).text(simpleSize);
		 	$tr.append(td);
		 	var time = parseInt(share.stime + '000', 10);
			var formatted;
			var text;
			if (time > 0) {
				formatted = OC.Util.formatDate(time);
				text = OC.Util.relativeModifiedDate(time);
			} else {
				formatted = t('files', 'Unable to determine date');
				text = '?';
			}
			 td = $('<td></td>').attr({ "class": "date" });
			 td.append($('<span></span>').attr({
				"class": "modified live-relative-timestamp",
				"title": formatted,
				"data-timestamp": time
				// "style": 'color:rgb('+modifiedColor+','+modifiedColor+','+modifiedColor+')'
			}).text(text)
			  .tooltip({placement: 'top'})
			);
			$tr.find('.filesize').text(simpleSize);
			$tr.append(td);
			return $tr;
		},
		_getIconUrl: function(fileInfo) {
			var mimeType = fileInfo.mimetype || 'application/octet-stream';
			if (mimeType === 'httpd/unix-directory') {
					return OC.MimeType.getIconUrl('dir-shared');
			}
			return OC.MimeType.getIconUrl(mimeType);
		}

	};

	OC.Plugins.register('OCA.Files.FileList', FilesPlugin)

})();
