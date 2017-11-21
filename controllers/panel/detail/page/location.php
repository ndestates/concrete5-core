<?php
namespace Concrete\Controller\Panel\Detail\Page;

use Concrete\Controller\Backend\UserInterface\Page as BackendInterfacePageController;
use Concrete\Core\Entity\Page\PagePath;
use PageEditResponse;
use PermissionKey;
use Exception;
use Loader;
use PageType;
use Permissions;
use User;
use Page;
use Request;
use Concrete\Core\Workflow\Request\MovePageRequest as MovePagePageWorkflowRequest;
use Concrete\Core\Workflow\Progress\Response as WorkflowProgressResponse;

class Location extends BackendInterfacePageController
{
    protected $viewPath = '/panels/details/page/location';
    protected $controllerActionPath = '/ccm/system/panels/details/page/location';
    protected $validationToken = '/panels/details/page/location';

    protected function canAccess()
    {
        return is_object($this->asl) && $this->asl->allowEditPaths();
    }

    public function on_start()
    {
        parent::on_start();
        $pk = PermissionKey::getByHandle('edit_page_properties');
        $pk->setPermissionObject($this->page);
        $this->asl = $pk->getMyAssignment();
    }

    public function view()
    {
        $c = $this->page;
        $this->requireAsset('core/sitemap');
        $cParentID = $c->getCollectionParentID();
        if ($c->isPageDraft()) {
            $cParentID = $c->getPageDraftTargetParentPageID();
        }
        $this->set('parent', Page::getByID($cParentID, 'ACTIVE'));
        $this->set('cParentID', $cParentID);

        // First, we pass in the auto generated page path. This is not actually necessarily a page path
        // pulled from the table,it's what it WOULD be based on URL slugs
        $autoGeneratedPath = $this->page->getAutoGeneratedPagePathObject();

        // now that we know the auto generated page path, we loop through all page paths. If a path matching
        // this path is set to be canonical, then we check that checkbox.
        $paths = [];
        foreach ($c->getPagePaths() as $path) {
            if ($path->getPagePath() == $autoGeneratedPath->getPagePath()) {
                if ($path->isPagePathCanonical()) {
                    $autoGeneratedPath->setPagePathIsCanonical(true);
                }
            } else {
                $paths[] = $path;
            }
        }

        if ($c->isHomePage()) {
            $autoGeneratedPath->setPagePathIsCanonical(true);
        }

        $this->set('autoGeneratedPath', $autoGeneratedPath);
        $this->set('paths', $paths);

        $this->set('isHome', $c->isHomePage());
    }

    public function submit()
    {
        $r = new PageEditResponse();
        if ($this->validateAction()) {
            $oc = $this->page;
            if ($oc->getCollectionParentID() != $_POST['cParentID']) {
                if ($this->page->isLocaleHomePage()) {
                    throw new Exception('You cannot move the homepage.');
                }
                $dc = Page::getByID($_POST['cParentID'], 'RECENT');
                if (!is_object($dc) || $dc->isError()) {
                    throw new Exception('Invalid parent page.');
                }
                $dcp = new Permissions($dc);
                $ct = PageType::getByID($this->page->getPageTypeID());
                if (!$dcp->canAddSubpage($ct)) {
                    throw new Exception('You do not have permission to add this subpage here.');
                }
                if (!$oc->canMoveCopyTo($dc)) {
                    throw new Exception('You cannot add a page beneath itself.');
                }

                if ($oc->isPageDraft()) {
                    $oc->setPageDraftTargetParentPageID($dc->getCollectionID());
                } else {
                    $u = new User();
                    $pkr = new MovePagePageWorkflowRequest();
                    $pkr->setRequestedPage($oc);
                    $pkr->setRequestedTargetPage($dc);
                    $pkr->setSaveOldPagePath(false);
                    $pkr->setRequesterUserID($u->getUserID());
                    $u->unloadCollectionEdit($oc);
                    $response = $pkr->trigger();
                    if ($response instanceof WorkflowProgressResponse && !$this->request->request->get('sitemap')) {
                        $nc = Page::getByID($oc->getCollectionID());
                        $r->setRedirectURL(Loader::helper('navigation')->getLinkToCollection($nc));
                    }
                }
            }

            // now we do additional page URLs
            $req = Request::getInstance();
            $oc->clearPagePaths();

            $canonical = $req->request->get('canonical');
            $pathArray = $req->request->get('path');

            if (isset($canonical) && $this->page->getCollectionID() == Page::getHomePageID()) {
                throw new Exception('You cannot change the canonical path of the home page.');
            }

            if (is_array($pathArray)) {
                foreach ($pathArray as $i => $path) {
                    if ($path) {
                        $p = new PagePath();
                        $p->setPagePath('/'.trim($path, '/'));
                        $p->setPageObject($this->page);
                        if ($canonical == $i) {
                            $p->setPagePathIsCanonical(true);
                        }
                        \ORM::entityManager()->persist($p);
                    }
                }
            }

            \ORM::entityManager()->flush();

            $r->setTitle(t('Page Updated'));
            $r->setMessage(t('Page location information saved successfully.'));
            $r->setPage($this->page);
            $nc = Page::getByID($this->page->getCollectionID(), 'ACTIVE');
            $r->outputJSON();
        }
    }
}
