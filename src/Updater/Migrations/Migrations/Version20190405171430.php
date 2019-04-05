<?php

namespace Concrete\Core\Updater\Migrations\Migrations;

use Concrete\Core\Page\Page;
use Concrete\Core\Updater\Migrations\AbstractMigration;
use Concrete\Core\Updater\Migrations\RepeatableMigrationInterface;
use Doctrine\DBAL\Schema\Schema;


class Version20190405171430 extends AbstractMigration implements RepeatableMigrationInterface
{

    public function upgradeDatabase()
    {
        $sp = Page::getByPath('/dashboard/system/registration/password_requirements');
        if (is_object($sp) && !$sp->isError()) {
            $this->createSinglePage('/dashboard/system/registration/password_requirements', 'Password Requirements', [
                'meta_keywords' => implode(', ', [
                    'password',
                    'requirements',
                    'code',
                    'key',
                    'login',
                    'registration',
                    'security',
                    'nist',
                ])
            ]);
        }

        $this->refreshEntities();
    }

}
