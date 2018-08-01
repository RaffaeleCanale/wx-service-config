# wx-service-config

Simple service that will serve configuration files for various applications.

See also: [Client implementation](https://github.com/RaffaeleCanale/wx-client-config)

## Installation
```sh
npm install
npm run start
```

## Config
The following configuration must be included in the `./config.json` file.
```json
{
	"server": {
		"port": 8080,
		"bodyLimit": "100kb",
		"corsHeaders": ["Link"]
	},
	"auth": {
		"secret": "<secret used to sign JWTs>",
		"password": "<password used to authenticate to the service>",
		"jwtExpiry": "1h"
	}
}
```
The `jwtExpiry` can be omitted or left blank to have tokens valid forever.

## Guide

Before any request, the client must request a JWT token from this service.
When doing so, the client specifies which **domains** it wants to access with that token.
The domains allow this service to restrict access to certain files for certain clients.
Domains can also be used to namespace the served files.


### Files

The service will serve files in the `./public` directory.
Here is a suggested hierarchy:
- `public`
    - `<project name>`
        - `<domain>.<filename>`
        - ...
    - ...



## Endpoints

- #### `POST /login/token`

Generate a new access JWT.

| Parameter | Type | Description |
| :-------------: |:-------------:| -----|
| `hash` | `String` | Hash of the service password (must match the one in the config file)|
| `domains` | `Array` | Domains that the generated token will be allowed to access |

#### Response
```json
{
    "token": "..."
}
```

- #### `GET /config`

Get a config file.

| Query Parameter | Type | Description |
| :-------------: |:-------------:| -----|
| `file` | `String` | Filename to get |
| `path` | `String` | Name of the directory where that file is located |

Required header: `Token: Bearer <Access JWT>`

#### Response
The corresponding file if it exists.
