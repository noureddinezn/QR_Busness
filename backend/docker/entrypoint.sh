#!/usr/bin/env sh
set -e

mkdir -p storage/app/public storage/framework/cache/data storage/framework/sessions storage/framework/views bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

if [ -n "${APP_KEY:-}" ]; then
  php artisan config:clear --no-interaction || true
  php artisan view:clear --no-interaction || true
  php artisan storage:link --no-interaction || true

  if [ "${APP_ENV:-local}" = "production" ]; then
    php artisan config:cache --no-interaction || true
    php artisan view:cache --no-interaction || true
  fi
fi

exec "$@"

