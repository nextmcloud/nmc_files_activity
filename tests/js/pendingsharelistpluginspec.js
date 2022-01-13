/**
 * Copyright (c) 2022 Kavita Sonawane
 *
 * @author Kavita Sonawane <kavita.sonawane@t-systems.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

describe('FilesPlugin tests', function() {
	var Plugin = FilesPlugin;

	beforeEach(function() {
		// init parameters and test table elements
		$('#testArea').append(
			'<div id="app-content-files">' +
			// init horrible parameters
			'<input type="hidden" id="dir" value="/"></input>' +
			'<input type="hidden" id="permissions" value="31"></input>' +
			// dummy controls
			'<div id="controls">' +
			'   <div class="actions creatable"></div>' +
			'   <div class="notCreatable"></div>' +
			'</div>' +
			// dummy table
			// TODO: at some point this will be rendered by the fileList class itself!
			'<table id="filestable" class="list-container view-grid">' +
			'<thead><tr>' +
			'<th id="allLabel">All</th>'+
			'<th id="headerName" class="hidden column-name">' +
			'<a class="name columntitle" data-sort="name"><span>Name</span><span class="sort-indicator"></span></a>' +
			'</th>' +
			'<th class="hidden column-mtime">' +
			'<a class="columntitle" data-sort="mtime"><span class="sort-indicator"></span></a>' +
			'</th>' +
			'</tr></thead>' +
			'<tbody id="fileList" class="pendingSharesList"></tbody>' +
			'<tbody id="fileList"></tbody>' +
			'<tfoot></tfoot>' +
			'</table>' +
			'<div id="emptycontent">Empty content message</div>' +
			'</div>'
		);
		testFiles = {
			id: 1,
			type: 'file',
			name: 'One.txt',
			mimetype: 'text/plain',
			stime: 11111000,
			size: 123,
			path: 'One.txt',
			displayname_file_owner: 'abc',
			uid_file_owner: 'pq',
			file_source: 12,
		}

	});

	describe('loading file list', function() {

		it('render files', function(done) {
			var $tr = Plugin.renderPendingShareRow(testFiles)
				expect($tr.length).toEqual(1);
				expect($tr.attr('data-id')).toEqual('12');
				expect($tr.attr('data-share-id')).toEqual('1');
				expect($tr.attr('data-file')).toEqual('One.txt');
				expect($tr.attr('data-size')).toEqual('123');
				expect($tr.attr('data-permissions')).toEqual('8');
				expect($tr.attr('data-mime')).toEqual('text/plain');
				expect($tr.attr('data-mtime')).toEqual('11111000');
				expect($tr.attr('data-share-owner-id')).toEqual('pq');
				expect($tr.find('.nametext').text().trim()).toEqual('One.txt');

				done();
		});
	});
});
