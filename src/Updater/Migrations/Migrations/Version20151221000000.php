<?php

namespace Concrete\Core\Updater\Migrations\Migrations;

use Concrete\Core\Page\Page;
use Concrete\Core\Updater\Migrations\AbstractMigration;
use Concrete\Core\Updater\Migrations\DirectSchemaUpgraderInterface;
use Concrete\Core\Updater\Migrations\RepeatableMigrationInterface;

class Version20151221000000 extends AbstractMigration implements RepeatableMigrationInterface, DirectSchemaUpgraderInterface
{
    /**
     * {@inheritdoc}
     *
     * @see \Doctrine\DBAL\Migrations\AbstractMigration::getDescription()
     */
    public function getDescription()
    {
        return '5.7.5.4';
    }

    /**
     * {@inheritdoc}
     *
     * @see \Concrete\Core\Updater\Migrations\DirectSchemaUpgraderInterface::upgradeDatabase()
     */
    public function upgradeDatabase()
    {
        // image resizing options
        $sp = Page::getByPath('/dashboard/system/files/image_uploading');
        if (!is_object($sp) || $sp->isError()) {
            $sp = \Concrete\Core\Page\Single::add('/dashboard/system/files/image_uploading');
            $sp->update(['cName' => 'Image Uploading']);
        }

        // background size/position
        \Concrete\Core\Database\Schema\Schema::refreshCoreXMLSchema([
            'StyleCustomizerInlineStyleSets',
        ]);

        $bt = \BlockType::getByHandle('image_slider');
        if (is_object($bt)) {
            $bt->refresh();
        }

        $bt = \BlockType::getByHandle('youtube');
        if (is_object($bt)) {
            $bt->refresh();
        }

        $bt = \BlockType::getByHandle('autonav');
        if (is_object($bt)) {
            $bt->refresh();
        }
    }
}
