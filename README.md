# Nodejs Auth Examples

1. Basic Auth
2. Passport.js LocalStrategy

Для генерации ключей шифрования:

```
node ./config/genKeys()
```

```
curl -X POST http://localhost:3000/register -H 'content-type: application/json' -d '{ "username": "<your username>", "password": "<your password>"}'

curl -X POST http://localhost:3000/login -H 'content-type: application/json' -d '{ "username": "<your username>", "password": "<your password>"}'

curl localhost:3000/dashboard -H "Authorization: Bearer <your token>"
```

3. Passport.js JWT
4. Passport.js OAuth
5. OpenID
6. Firebase Authentication

## Cookies

* httpOnly
* secure
* ephemeral

## Hasing

* scrypt

## Views

* register
* login
* dashboard

## Todo
* CSRF
* Helmet
* JWT: fix html files, add refresh token?

