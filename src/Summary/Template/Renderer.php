<?php

namespace Concrete\Core\Summary\Template;

use Concrete\Core\Summary\SummaryObjectInterface;
use Concrete\Core\Foundation\Serializer\JsonSerializer;
use Concrete\Core\Logging\Channels;
use Concrete\Core\Logging\LoggerAwareInterface;
use Concrete\Core\Logging\LoggerAwareTrait;
use Concrete\Core\Page\Page;
use Concrete\Core\Summary\Category\CategoryMemberInterface;
use Concrete\Core\Summary\Data\Collection;
use Doctrine\ORM\EntityManager;
use Concrete\Core\Summary\SummaryObject;

class Renderer implements LoggerAwareInterface
{

    use LoggerAwareTrait;

    /**
     * @var EntityManager
     */
    protected $entityManager;

    /**
     * @var TemplateLocator
     */
    protected $templateLocator;

    /**
     * @var Page
     */
    protected $currentPage;

    /**
     * @var JsonSerializer
     */
    protected $serializer;

    /**
     * @var RendererFilterer 
     */
    protected $rendererFilterer;
    
    public function __construct(
        JsonSerializer $serializer, 
        RendererFilterer $rendererFilterer,
        EntityManager $entityManager, 
        TemplateLocator $templateLocator, 
        Page $currentPage)
    {
        $this->serializer = $serializer;
        $this->rendererFilterer = $rendererFilterer;
        $this->entityManager = $entityManager;
        $this->templateLocator = $templateLocator;
        $this->currentPage = $currentPage;
    }

    public function getLoggerChannel()
    {
        return Channels::CHANNEL_CONTENT;
    }

    public function render(SummaryObjectInterface $summaryObject)
    {
        $template = $summaryObject->getTemplate();
        $file = $this->templateLocator->getFileToRender($template);
        if ($file) {
            $fields = $summaryObject->getData()->getFields();
            extract($fields, EXTR_OVERWRITE);
            include $file;
        } else if ($template->getHandle()) {
            $this->logger->notice(t('Error rendering summary template on page %s - Unable to locate file for summary template: %s',
                    $this->currentPage->getCollectionID(), $template->getHandle())
            );
        }
    }
    
    public function renderSummaryForObject(CategoryMemberInterface $object, string $templateHandle = null)
    {
        $categoryTemplate = null;
        if ($templateHandle) {
            $categoryTemplate = $this->rendererFilterer->getSpecificTemplateIfExists($object, $templateHandle);
        } else {
            $categoryTemplate = $this->rendererFilterer->getRandomTemplate($object);
        }
        if ($categoryTemplate) {
            $template = $categoryTemplate->getTemplate();
            if ($template) {
                $collection = $categoryTemplate->getData();
                
                $object = new SummaryObject(
                    $object->getSummaryCategoryHandle(), 
                    $object->getSummaryIdentifier(),
                    $template,
                    $collection
                );
                $this->render($object);
            }
        }
    }


}
