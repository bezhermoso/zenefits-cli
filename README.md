# Zenefits CLIo

### Installation

```
npm install -g zenefits-cli
```

### Setup

First you must specify your Zenefits credentials. You can do it in two different ways:

#### Method 1: Environment variables

Add this to your `~/.profile`:

```bash
ZENEFITS_USERNAME=<your email>
ZENEFITS_PASSWORD=<your password>
```

#### Method 2: Credentials file

Create the file `~/.zenefits.json` containing the following:

```javascript
{
    "username": "<your email>",
    "password": "<your password>"
}
```

## Commands

```
zenefits in
zenefits out
zenefits lunch
zenefits endlunch
```

## @todos

- [x] Run in PhantomJS (no visible browser window). Work exists in the `phantomjs` branch.
- [ ] Smart handling of state i.e. don't clock in twice in a row, etc.


## Integrations

* [zenefits-alfred-workflow](https://github.com/bezhermoso/zenefits-alfred-workflow/) - Workflow for [Alfred](https://alfredapp.com).
* [lacona-zenefits](https://github.com/evanjenkins/lacona-zenefits/) - Command for [Lacona](https://lacona.io).


