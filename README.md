# typeormtest

Typeorm test environment

## Technology

Test project `test` is created by `typeorm init`.

```
$ npx typeorm init --name test --docker
```

## Test

* Start PostgreSQL

```
$ cd test
$ docker compose up -d
```

* Test test/src/index.ts

```
$ npm start
```


