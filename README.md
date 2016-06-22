# Zenefits CLI

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
