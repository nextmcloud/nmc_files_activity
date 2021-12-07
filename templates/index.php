<?php
/**
 * @copyright Copyright (c) 2016, ownCloud, Inc.
 *
 * @author Jan-Christoph Borchardt <hey@jancborchardt.net>
 * @author Joas Schilling <coding@schilljs.com>
 * @author Thomas Müller <thomas.mueller@tmit.eu>
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
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

use OCA\Activity\BackgroundJob\ExpireActivities;

script('activity', [
	'richObjectStringParser',
	'templates',
	'feedSettings',
]);

?>

<div id="app-content">
	<div class="controls-section"></div>
	<div class="del-files-activity-container hidden">
		<div class="file-activity-heading">
			<?php p($l->t('Activities')) ?>
		</div>
		<div class="file-activity-note">
			<?php p($l->t('Notifications are only visible to you and are stored just as securely encrypted in your MagentaCLOUD as your data. You can still delete your activities. Please note that activities regarding shared content cannot be deleted, as they belong to the sharer.')) ?>
		</div>
		<div class="del-files-activity-div">
			<a class="del-files-activity"><button type="button" class="btn btn-default btn-style"><?php p($l->t('Delete all activities')) ?></button></a>
		</div>
	</div>

	<div id="emptycontentCustom" class="hidden">
		<div class="icon-activity"></div>
		<h2><?php p($l->t('No activity yet')); ?></h2>
		<p><?php p($l->t('This stream will show events like additions, changes & shares')); ?></p>
	</div>

	<div id="container" data-activity-filter="all" data-avatars-enabled="yes">	</div>

	<div id="loading_activities" class="icon-loading"></div>

	<div id="no_more_activities" class="hidden">
		<?php p($l->t('No more events to load')) ?>
	</div>
</div>

<?php
	script('nmc_files_activity', 'pendingsharelistplugin');
	script('nmc_files_activity', 'script');
	style('activity', 'style');
	style('nmc_files_activity', 'style');
?>
