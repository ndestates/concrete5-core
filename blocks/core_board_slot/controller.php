<?php
namespace Concrete\Block\CoreBoardSlot;

use Concrete\Core\Block\BlockController;
use Concrete\Core\Board\Instance\Slot\Content\ContentRenderer;
use Concrete\Core\Board\Instance\Slot\Menu\Manager;
use Concrete\Core\Entity\Board\InstanceSlot;
use Concrete\Core\Entity\Board\SlotTemplate;
use Concrete\Core\Feature\Features;
use Concrete\Core\Feature\UsesFeatureInterface;
use Doctrine\ORM\EntityManager;

class Controller extends BlockController implements UsesFeatureInterface
{
    protected $btTable = 'btCoreBoardSlot';
    protected $btIsInternal = true;
    protected $btIgnorePageThemeGridFrameworkContainer = true;
    
    public $contentObjectCollection;
    
    public $slotTemplateID;
    
    public $instanceSlotID;
    
    public function getRequiredFeatures(): array
    {
        return [
            Features::BOARDS
        ];
    }

    public function getBlockTypeDescription()
    {
        return t("Proxy block for board slots.");
    }

    public function getBlockTypeName()
    {
        return t("Board Slot");
    }
    
    public function getInstanceSlotID()
    {
        return $this->instanceSlotID;
    }
    
    
    public function view()
    {
        $template = null;
        if ($this->slotTemplateID) {
            $entityManager = $this->app->make(EntityManager::class);
            $slot = $entityManager->find(InstanceSlot::class, $this->instanceSlotID);
            if ($slot) {
                $template = $entityManager->find(SlotTemplate::class, $this->slotTemplateID);
                $renderer = $this->app->make(ContentRenderer::class);
                $collection = $renderer->denormalizeIntoCollection(json_decode($this->contentObjectCollection, true));
                $menuManager = $this->app->make(Manager::class);
                $this->set('dataCollection', $collection);
                $this->set('renderer', $renderer);
                $this->set('template', $template);
                $this->set('slot', $slot);
                $this->set('menu', $menuManager->getMenu($slot));
            }
        }
    }
    
}
