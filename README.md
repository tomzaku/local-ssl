# Get started

```
npm install -g local-ssl
```

```
  _    ___   ___   _   _       ___ ___ _    
 | |  / _ \ / __| /_\ | |  ___/ __/ __| |   
 | |_| (_) | (__ / _ \| |_|___\__ \__ \ |__ 
 |____\___/ \___/_/ \_\____|  |___/___/____|

Usage: local-ssl [options]

A CLI tool to enable your local ssl just a single step

Options:
  -V, --version              output the version number
  -s, --source <port>        Source port to enable ssl
  -t, --target <port>        Target port
  -n, --hostname <hostname>  Hostname to certificate such as: localhost, facebook.com
  -do, --disable-open        Disable open the page
  -rh, --remove-hostname     Remove hostname when exist
  -i, --install              Install requirement packages
  -h, --help                 display help for command

```

# Demo

```
local-ssl -t 3000 -s 443 -n abcxyz.com
```


https://user-images.githubusercontent.com/19413272/162612386-4980cb4a-871a-448a-b9ef-1b959f5ca715.mov

