/*
 * This file is part of the conga-dependency-injection module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Export all of the public objects
 */
var requires = {
  Container: require('./lib/container'),
  ContainerBuilder: require('./lib/container-builder'),
  ServiceLoader: require('./lib/service-loader')
};

module.exports = requires;