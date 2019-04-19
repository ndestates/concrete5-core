<?php
namespace Concrete\Core\Site;

use Concrete\Core\Foundation\Service\Provider as BaseServiceProvider;
use Concrete\Core\Site\Resolver\MultisiteDriver;
use Concrete\Core\Site\Resolver\Resolver;
use Concrete\Core\Site\Resolver\StandardDriver;
use Concrete\Core\Url\DomainMapper\Map\Normalizer;
use Concrete\Core\Url\DomainMapper\Map\NormalizerInterface;

class ServiceProvider extends BaseServiceProvider
{
    public function register()
    {
        $app = $this->app;
        $this->app->singleton('site', function() use ($app) {
            return $app->make('Concrete\Core\Site\Service');
        });
        $this->app->singleton('site/type', function() use ($app) {
            return $app->make('Concrete\Core\Site\Type\Service');
        });

        $this->app->bind(NormalizerInterface::class, Normalizer::class);

        $this->app->singleton('Concrete\Core\Site\Resolver\DriverInterface', function() use ($app) {
            $config = $this->app->make('config');
            $site = $config->get('site');
            if (isset($site['sites']) && is_array($site['sites']) && count($site['sites']) > 1) {
                $resolver = $this->app->make(MultisiteDriver::class);
            } else {
                $resolver = $this->app->make(StandardDriver::class);
            }
            return $resolver;
        });
    }
}
