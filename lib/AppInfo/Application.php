<?php
/**
 * @copyright Copyright (c) 2016, ownCloud, Inc.
 *
 * @author Christoph Wurst <christoph@winzerhof-wurst.at>
 * @author Morris Jobke <hey@morrisjobke.de>
 * @author Robin Appelman <robin@icewind.nl>
 * @author Roeland Jago Douma <roeland@famdouma.nl>
 * @author Victor Dubiniuk <dubiniuk@owncloud.com>
 *
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program. If not, see <http://www.gnu.org/licenses/>
 *
 */

namespace OCA\NmcfilesActivity\AppInfo;

use OCA\DAV\Connector\Sabre\Principal;
use OCP\App\IAppManager;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\ILogger;
use OCP\IServerContainer;

class Application extends App implements IBootstrap {
	public function __construct(array $urlParams = []) {
		parent::__construct('nmc_files_activity', $urlParams);
	}

	public function register(IRegistrationContext $context): void {
		$context->registerCapability(Capabilities::class);

		$context->registerServiceAlias('Expiration', Expiration::class);
		$context->registerServiceAlias(ITrashManager::class, TrashManager::class);
		/** Register $principalBackend for the DAV collection */
		$context->registerServiceAlias('principalBackend', Principal::class);
	}

	public function boot(IBootContext $context): void {
		\OCA\Files\App::getNavigationManager()->add(function () {
			$l = \OC::$server->getL10N('activity');
			return [
				'id' => 'nmc_files_activity',
				'appname' => 'nmc_files_activity',
				'script' => 'list.php',
				'name' => $l->t('Activities')
			];
		});

	}
}
