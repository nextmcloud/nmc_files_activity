<?php
namespace OCA\NmcFilesActivity\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

use Doctrine\DBAL\Platforms\MySQLPlatform;
use OCA\Activity\Filter\AllFilter;
use OCP\Activity\IEvent;
use OCP\Activity\IExtension;
use OCP\Activity\IFilter;
use OCP\Activity\IManager;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;
use OCP\ICache;
use OCP\ICacheFactory;
use OCP\IURLGenerator;
use OCP\ILogger;
use OCP\IMemcache;
use OC\Memcache\NullCache;

class PageController extends Controller {
	private $userId;

	/** @var IDBConnection */
	protected $connection;

	/** @var ICacheFactory */
	private $cacheFactory;

	/** @var IMemcache */
	private $lockingCache;

	/** @var IURLGenerator */
	protected $urlGenerator;

	/** @var ILogger */
	protected $logger;

	public function __construct($AppName, IRequest $request, $UserId, IDBConnection $connection, IURLGenerator $urlGenerator, ICacheFactory $cacheFactory, ILogger $logger,){
		parent::__construct($AppName, $request);
		$this->userId = $UserId;
		$this->connection = $connection;
		$this->urlGenerator = $urlGenerator;
		$this->logger = $logger;
		$lockingCache = $cacheFactory->createDistributed('Activity-locks');
		if (!($lockingCache instanceof IMemcache)) {
			$lockingCache = new NullCache();
		}
		$this->lockingCache = $lockingCache;
	}


	/**
	 * CAUTION: the @Stuff turns off security checks; for this page no admin is
	 *          required and no CSRF check. If you don't know what CSRF is, read
	 *          it up in the docs or you might create a security hole. This is
	 *          basically the only required method to add this exemption, don't
	 *          add it to any other method if you don't exactly know what it does
	 *
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function index() {
		// return new TemplateResponse('nmc_files_activity', 'index');  // templates/index.php
	}

	/**
	* @NoAdminRequired
	*/
	public function deleteActivitiesCustom() {
		if (!$this->lockingCache->hasKey($this->userId)) {
			$this->lockingCache->set($this->userId, 'locked', 10);
			$this->logger->debug('***********Lock applied for 10 seconds***************', ['app' => 'nmc_files_activity']);
			$sqlWhere = ' WHERE ' . " user='".$this->userId."'";

			// Add galera safe delete chunking if using mysql
			// Stops us hitting wsrep_max_ws_rows when large row counts are deleted
			if ($this->connection->getDatabasePlatform() instanceof MySQLPlatform) {
				// Then use chunked delete
				$max = 100000;
				$query = $this->connection->prepare(
					'DELETE FROM `*PREFIX*activity`' . $sqlWhere . " LIMIT " . $max);

				do {
					$query->execute();
					$deleted = $query->rowCount();
				} while ($deleted === $max);
			} else {
				// Dont use chunked delete - let the DB handle the large row count natively
				$query = $this->connection->prepare(
					'DELETE FROM `*PREFIX*activity`' . $sqlWhere);
				$query->execute();
			}
            $this->lockingCache->remove($this->userId);
		}
	}
}
