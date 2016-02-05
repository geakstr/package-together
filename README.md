If you have a project divided into several services that use the same dependencies the same versions — `package-together` can be useful. With it you describe all sub `package.json` files in one place. So versions of the dependencies is the same for all subprojects.

Install by `npm install package-together`

Imagine you have next project with two submodules `api` and `client` and `package.json`.

```
--project
   |--api
   |--client
   package.json
```
   
You use `async` module in each submodule and you want to have the same version of it. With `package-together` you don't need to create separate `api/package.json` and `client/package.json`, instead write all in `project/package.json`.

```json
...
"packages": {
  "api": {
    "dependencies": ["async"]
  },
  "client": {
    "dependencies": ["async"]
  }
},
"dependencies": {
  "async": "1.5.2"
}
...
```
