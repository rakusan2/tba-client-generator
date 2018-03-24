# TBA API V3 Client

An auto generated client for the [The Blue Alliance V3 API](https://www.thebluealliance.com/apidocs/v3) from the [TBA V3 Swagger Document](https://www.thebluealliance.com/swagger/api_v3.json)

The generated file is a Typescript file with Type Definitions for all of the types provided in the [TBA V3 API Spec](https://www.thebluealliance.com/apidocs/v3)

Therefore if this is used in any Typescript enabled editor then types will be provided whether it is for type checking in TS files or just ensuring correct spelling in JS files

This client supports cashing and can be used using either [Promises](#promise) or [Callbacks](#callback)

## Installation
```
npm install tba-api-client
```

## Usage Examples

Using [Promise](#promise)
```ts
const TBA = require("tba-api-client")
const client = TBA.API("{TBA API KEY}")

client.Teams(2017, 0).then( teams =>{ // Gets the first page of the teams that were active in 2017
    console.log(teams)
}).catch(console.error)
```

Using Async functions
```ts
const TBA = require("tba-api-client")
const client = TBA.API("{TBA API KEY}")

async function main(){
    let teams = await client.Teams(2017, 0) // Gets the first page of the teams that were active in 2017
}

main().catch(console.error)

```

Using [Callbacks](#callback)
```ts
const TBA = require("tba-api-client")
const client = TBA.API("{TBA API KEY}")

client.Teams(2017, 0, (err, teams) => { // Gets the first page of the teams that were active in 2017
    if(err != null) console.error(err)
    else console.log(teams)
})
```

Using [Listeners](#listener)
```ts
const TBA = require("tba-api-client")
const client = TBA.API("{TBA API KEY}")

client.Teams(2017, 0, (err, teams) => { // Gets the first page of the teams that were active in 2017
    if(err != null) console.error(err)
    else console.log(teams)
}, true) // The last argument Sets this callback to be called every time the server responds with a 202 instead of a 303
```

Using the [onCashExpire callbacks](#oncashexpire)
```ts
const TBA = require("tba-api-client")
const client = TBA.API("{TBA API KEY}")

getMatchesInfo(client.TeamMatches('frc3571', 2018, getPromise => getMatchesInfo(getPromise())))

function getMatchesInfo(matchPromise){
    matchPromise.then(matches=>{

    }).catch(console.error)
}

```
## Definition
After being built, the type definitions will be located in [`types/genAPI.d.ts`](https://github.com/rakusan2/tba-client-generator/blob/master/types/genAPI.d.ts)

All function calls are located in in the class API and with names that ware taken from their paths with a minor exception

The parameters for these function are in the same order as as in their path with optional additional Parameters

For Example:
* `TeamRobots(team_key)` points to `/team/{team_key}/robots`
* `EventTeamsStatuses(event_key)` points to `/event/{event_key}/teams/statuses`
* `TeamMedia(team_key, year)` points to `/team/{team_key}/media/{year}`
* `TeamMedia(team_key, year)` points to `/team/{team_key}/media/{year}`

The exceptions comes to:
* Those that would have the same name
* And TeamMedia

For the use of the API check out [The API Docs](https://www.thebluealliance.com/apidocs/v3)

### Same Name
Those with the same name have been combined and will give a different result depending on the parameters
* `Teams(page_num)` points to `/teams/{page_num}`
* `Teams(year, page_num)` points to `/teams/{year}/{page_num}`

### TeamMedia
This is a combination of three paths:
* `/team/{team_key}/media/{year}`
* `/team/{team_key}/media/tag/{media_tag}`
* `/team/{team_key}/media/tag/{media_tag}/{year}`

These should have had the names TeamMedia and TeamMediaTag but since combining them would not cause an error and them being similar, it was decided to just combine them and let the parameters decide which path would be used

### Promise
This is a standard Promise containing the value of the request

Example:
```ts
client.Teams(0).then(teams => {
    // Gets the First page of all Teams using a promise
}).catch(console.error)
```


### OnCashExpire
This callback contains a function for a new Promise for the same path

This cashExpire callback is identified by having only a single argument

Example:
```ts
client.Teams(0, onExpire =>{
    // This will run when the cache will expire
    onExpire().then(teamLater => { // By calling onExpire a new GET request was made to the same path which will renew the cache
        // This will have the result of the new request
    }).catch(console.error)
}).then(teamNow => {
    // This will run once with teamNow having either the value from the cache if it is still fresh or the result of a new request if not
}).catch(console.error)
```

### Callback
This is a standard error first callback that can be used instead Promises

This callback is identified by having two arguments

Example:
```ts
client.Teams(2018, 0, (err, teams) => { // Gets the first page of Teams active in 2018
    // Returns with a value from cache if it is fresh or the value from a request if not 
}, true)
```

### Listener
By setting the parameter after the callback to true, the callback becomes a listener for changes to the values from the path

To Remove the listener call `removeListener(id)` where `id` is what is returned by the function that set the listener

Example:
```ts
let teamsID = client.TeamMatches('frc3571', 2018, (err, matches) => { // Sets a listener for team 3571's 2018 matches
    // Runs after the first request is made and when the value changes
}, true)

client.removeListener(teamsID) // Removes the listener
```

## Build Instructions
1. Clone [The Repository](https://github.com/rakusan2/tba-client-generator)
    * The npm package does not contain the generator
2. Run `npm i`
3. Run `npm run build`

