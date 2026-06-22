# Database Setup (PostgreSQL + Prisma)

This project uses **PostgreSQL** as its database and **Prisma** as the ORM.

## 1. Install PostgreSQL

### Windows
1. Download the installer from https://www.postgresql.org/download/windows/
2. Run it and set a password for the default `postgres` superuser (remember it).
3. Keep the default port `5432`.
4. After install, confirm the server is running (Services → `postgresql-x64-…` → Running).

### macOS (Homebrew)
```bash
brew install postgresql@16
brew services start postgresql@16
```

### Linux (Debian/Ubuntu)
```bash
sudo apt update && sudo apt install postgresql
sudo service postgresql start
```

## 2. Create the database

Open `psql` (or pgAdmin) and create the database:

```sql
CREATE DATABASE smartcoverauto;
```

From the command line you can run:
```bash
psql -U postgres -c "CREATE DATABASE smartcoverauto;"
```

## 3. Configure the connection string

Copy `.env.example` to `.env` (in the project root) and update `DATABASE_URL`
with your credentials:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/smartcoverauto?schema=public"
```

## 4. Run the first migration

This creates the `Admin` and `Lead` tables and generates the Prisma Client:

```bash
npx prisma migrate dev --name init
```

## 5. Useful commands

| Command | Purpose |
| --- | --- |
| `npx prisma migrate dev --name <name>` | Create & apply a new migration (dev) |
| `npx prisma migrate deploy` | Apply migrations in production |
| `npx prisma generate` | Regenerate the Prisma Client |
| `npx prisma studio` | Open a GUI to browse/edit data |
| `npx prisma db push` | Sync schema without a migration (prototyping) |

## 6. Using the client in code

Import the shared singleton instead of `new PrismaClient()`:

```js
import prisma from "@/lib/prisma";

const leads = await prisma.lead.findMany();
```
