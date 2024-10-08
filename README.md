# Nya metakatalogen

## APIer som används

Dessa APIer används i projektet, applikationsanvändaren i WSO2 måste prenumerera på dessa.

| API       | Version |
| --------- | ------: |
| Employee  |     1.0 |
| Messaging |     5.0 |
| MDBuilder |     1.0 |
| MDViewer  |     1.0 |

## Utveckling

### Krav

- Node >= 16 LTS
- Yarn

### Steg för steg

1. Klona ner repot.

```
git clone git@github.com:Sundsvallskommun/web-app-new-meta-catalogue.git
```

2. Installera dependencies för både `backend` och `frontend`

```
cd frontend
yarn install

cd backend
yarn install
```

3. Skapa .env-fil för `frontend`

```
cd frontend
cp .env-example .env
```

Redigera `.env` för behov, för utveckling bör exempelvärdet fungera.

4. Skapa .env-fil för `backend`

```
cd backend
cp .env.example.local .env.development.local
cp .env.example.local .env.test.local
```

redigera `.env.development.local` för behov. URLer, nycklar och cert behöver fyllas i korrekt.

- `CLIENT_KEY` och `CLIENT_SECRET` måste fyllas i för att APIerna ska fungera, du måste ha en applikation från WSO2-portalen
- `SAML_ENTRY_SSO` behöver pekas till en SAML IDP
- `SAML_IDP_PUBLIC_CERT` ska stämma överens med IDPens cert
- `SAML_PRIVATE_KEY` och `SAML_PUBLIC_KEY` behöver bara fyllas i korrekt om man kör mot en riktig IDP

5. Initiera eventuell databas för backend

```
cd backend
yarn prisma:generate
yarn prisma:migrate
```

### Synka interfaces från microtjänster till backend

```
cd backend
yarn generate:contracts
```

### Synka interfaces från backend till frontend

backend måste vara igång (swagger.json hostas)

```
cd frontend
yarn generate:contracts
```
