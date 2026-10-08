FROM php:8.3-cli-alpine

WORKDIR /var/www/html

RUN apk add --no-cache \
    bash \
    curl \
    git \
    libzip-dev \
    postgresql-dev \
    unzip \
  && docker-php-ext-install pdo_pgsql zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --prefer-dist \
    --no-interaction \
    --no-progress \
    --no-scripts \
    --optimize-autoloader

COPY . .
COPY docker/entrypoint.sh /usr/local/bin/qrprofile-entrypoint

RUN sed -i 's/\r$//' /usr/local/bin/qrprofile-entrypoint \
  && chmod +x /usr/local/bin/qrprofile-entrypoint \
  && composer dump-autoload --optimize \
  && mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views bootstrap/cache \
  && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:8000/api/health >/dev/null || exit 1

ENTRYPOINT ["qrprofile-entrypoint"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

