# pgAdmin / PostgreSQL Setup

Use these values when registering the local PostgreSQL server in pgAdmin:

```text
Name: QR Restaurant
Host name/address: localhost
Port: 5432
Maintenance database: postgres
Username: postgres
Password: your PostgreSQL password
```

Create the project database:

```sql
CREATE DATABASE qr_profile;
```

Then update `backend/.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=qr_profile
DB_USERNAME=postgres
DB_PASSWORD=your PostgreSQL password
```

If your password contains spaces or symbols such as `#`, wrap it in quotes:

```env
DB_PASSWORD="my#password"
```

Run Laravel setup from the backend folder:

```powershell
cd C:\Users\noureddine\OneDrive\Desktop\QR_restaurant\backend
php artisan config:clear
php artisan migrate
php artisan db:seed
php artisan storage:link
```

Demo accounts after seeding:

```text
demo@example.com / password123
admin@example.com / password123
```

If `php artisan migrate` says `fe_sendauth: no password supplied`, then `DB_PASSWORD` is still empty or Laravel has cached the old config. Fill `DB_PASSWORD`, then run:

```powershell
php artisan config:clear
```
