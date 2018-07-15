<img src="https://github.com/authmagic/authmagic/blob/master/docs/images/logo.png?raw=true" width="300px"/>

authmagic
========================
Reusable, extendable authorization service.


Motivation
-----------
How many time you had to reimplement separate authorization service in your projects? Almost any authorization factor you need was already implemented many times. Why do it again?
There are other solutions to achieve similar result. Authmagic is different because it's architecture designed with simplicity and extendability in mind.

Why would you ever separate resource service and authorization service?
-----------
1. If you would have multiple client applications then there will be no need to reimplement authorization logic.
2. Separation of concerns. If you have an option to make your architecture and code simpler - please, do it, it will pay off when your app grows.
3. External clients applications could trust your authorization service (<a href="https://oauth.net/2/">OAuth 2</a>).

Structure
-----------
<img src="https://github.com/authmagic/authmagic/blob/master/docs/images/authmagic-structure.png" alt="authmagic structure" width="600px"/>
Authmagic itself is a holder for core, plugins and theme.

At the moment we have only one core implemented - <a href="https://github.com/authmagic/authmagic-timerange-stateless-core">authmagic-timerange-stateless-core</a>.

Different cores could give you different authorization workflows. You can have OAuth core, core to authorize with username/password stored in the db, single-factor authorization with magic link or code.. Or even core which will be a fork for multiple cores.

Our goal is to keep everything flexible and simple.
Plugins are extensions for the core. For example, you may want to send magic link for single-factor authorization via email or sms, or in messenger. Or you may want to connect to postgresql db, or you may want to keep your users list in the sql lite.. Plugins are dependent on a core.

Theme is what you see during authorization process. If you have a small project or if you are okay with some standard UI - it's for you. Also, you may easily edit (fork) theme to adapt it to your design requirements.

Framework connectors are used to allow your API's to communicate with authorization service. For example you may work with ruby on rails and you would have a private page for user Mike, so you would like to verify that page was requested by Mike.

What's inside?
-----------
We decided to built authmagic with Node.js. Node.js continues to expand the market and almost any developer can read javascript today. It makes authmagic more commonly understandable without a tangible tradeoff in the performance (go or elixir could be better choise here) and "code quality" (something more similar to java would be better for this metric).
Authmagic expects that core would be created with <a href="https://github.com/koajs/koa">koa2</a> framework.

Configuration file
-----------
To specify core, plugins, theme and their parameters authmagic.js (configuration file's name) should be used. Example of configuration file:
```
module.exports = {
  "core": {
    "name": "authmagic-timerange-stateless-core",
    "source": "../authmagic-timerange-stateless-core"
  },
  "plugins": {
    "authmagic-email-plugin": {
      "source": "../authmagic-email-plugin"
    }
  },
  "params": {
    "authmagic-email-plugin": {
      "isTest": true,
      "mailer": {
        "auth": {
          "user": "",
          "pass": ""
        },
        "host": "smtp.ethereal.email",
        "port": 587,
        "secure": false
      },
      "from": "AuthMailer",
      "subject": "Your Magic Link"
    },
    "authmagic-timerange-stateless-core": {
      "duration": 300,
      "key": "ad6de0e6c809b89b",
      "sendKeyPlugin": "authmagic-email-plugin",
      "expiresIn": 1200
    }
  },
  "port": 3000,
  "theme": {
    "name": "authmagic-link-email-phone-bootstrap-theme",
    "source": "../authmagic-link-email-phone-bootstrap-theme"
  }
};
```
You can generate these files simply writing few lines in the console using <a href="https://github.com/authmagic/authmagic-cli">authmagic-cli</a>. It will download and install core, plugins, theme and help you to configure them.

Getting started
-----------
Check <a href="https://github.com/authmagic/authmagic-getting-started-example">authmagic-getting-started-example</a>.

Collaboration
-----------
Working is better then unfinished perfect. Project is in the alpha version, we are testing it out. If you see architectural issues, things to improve or you just have something relevant to share, drop me few words: oleksandrknyga@gmail.com
I would also be glad to help you to integrate authmagic into your projects. Pull requests are welcome as well.

Licence
-----------
authmagic is [MIT licensed](./LICENSE).
