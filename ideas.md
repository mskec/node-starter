# Ideas

* ~~Blacklisting tokens~~
* Multi-service project structure
* gitlab CI config


**Multi-service project structure**
```
/server
  /some-service
  /common
    /third-party-api
    /models
    /services
  /config
    config.ts
    database.js
  /api
    /controllers
    /routes
      index.route.ts
    /tests
    express.ts
```
