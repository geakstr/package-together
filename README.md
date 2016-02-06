# package-together

Install: `npm install package-together`

`package-together` allow to describe all sub `package.json` files for complex project in one main `package.json`. The advantage of this — guarantee to use the same versions of the dependencies throughout the project.

Imagine you have next project with two subprojects `api` and `client`:

```
project
  |--api
  |--client
  package.json
```

With `package-together` you don't need to create separate `project/api/package.json` and `project/client/package.json`, instead write all of this in `project/package.json` in `subpackages` section:

```json
{
   "name": "project name",
   "version": "1.0.0",
   "description": "Oh my project",
   "scripts": {
     "postinstall": "node ./node_modules/package-together/index.js"
   },
   "subpackages": {
     "api": {
       "name": "api",
       "version": "1.0.1",
       "description": "API project",
       "dependencies": ["async", "bcryptjs"],
       "devDependencies": ["eslint", "nodemon"]
     },
     "client": {
       "name": "client",
       "version": "2.1.3",
       "description": "Client project",
       "dependencies": ["async"],
       "devDependencies": ["eslint", "webpack"]
     }
   },
   "dependencies": {
     "async": "1.5.2",
     "bcryptjs": "2.3.0"
   },
   "devDependencies": {
      "nodemon": "^1.8.1",
      "webpack": "^1.12.12",
      "eslint": "^1.10.3"
   }
}
```

After `npm install` (look, we have `postinstall` task) `package-together` build (completely rewrite) sub `package.json` and install dependencies for each subproject.

```json
// project/api/package.json
{
   "name": "api",
   "version": "1.0.1",
   "description": "API project",
   "dependencies": {
      "async": "1.5.2",
      "bcryptjs": "2.3.0"
   },
   "devDependencies": {
      "nodemon": "^1.8.1",
      "eslint": "^1.10.3"
   }
}
```

```json
// project/client/package.json
{
   "name": "client",
   "version": "2.1.3",
   "description": "Client project",
   "dependencies": {
      "async": "1.5.2"
   },
   "devDependencies": {
      "eslint": "^1.10.3",
      "webpack": "^1.12.12"
   }
}
```

As you can see `api` and `client` has common dependencies (`async` and `eslint`) with the same version.

If you want use specific version of dependency for subproject `package-together` allow this via next syntaxis: `"dependencies": ["async@1.3.0"]`.

For using all dependencies from main `package.json` declare `"dependencies": true`, `"devDependencies": true`.
