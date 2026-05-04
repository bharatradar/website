---
title: "Bare Metal"
lead: "Using your existing ADS-B receiver"
draft: false
images: []
type: docs
weight: 103
---
- These scripts aid in setting up your current ADS-B receiver to feed [bharatradar.com](https://bharatradar.com)
- They will not disrupt any existing feed clients already present

## 1: Find coordinates / elevation:

<https://www.freemaptools.com/elevation-finder.htm>

## 2: Install the bharatradar feed client

```
curl -L -o /tmp/lol-feed.sh https://bharatradar.com/feed.sh
sudo bash /tmp/lol-feed.sh
```

## 3: Check if your feed is working

That one's easy! Just go to <https://bharatradar.com> and you should show as feeding.


### Optional: local interface for your data http://192.168.X.XX/bharatradar

Install / Update:
```
sudo bash /usr/local/share/bharatradar/git/install-or-update-interface.sh
```
Remove:
```
sudo bash /usr/local/share/tar1090/uninstall.sh bharatradar
```

## Misc maintenance
### Update

Update the feed client without reconfiguring

```
curl -L -o /tmp/lol-update.sh https://raw.githubusercontent.com/bharatradar/feed/master/update.sh
sudo bash /tmp/lol-update.sh
```


### Troubleshooting issues

If you encounter issues, please do a reboot and then supply these logs on [zulip](https://bharatradar.zulipchat.com) (last 20 lines for each is sufficient):

```
sudo journalctl -u bharatradar-feed --no-pager
sudo journalctl -u bharatradar-mlat --no-pager
```


### Display the configuration

```
cat /etc/default/bharatradar
```

### Changing the configuration

This is the same as the initial installation.
If the client is up to date it should not take as long as the original installation,
otherwise this will also update the client which will take a moment.

```
curl -L -o /tmp/lol-feed.sh https://bharatradar.com/feed.sh
sudo bash /tmp/lol-feed.sh
```

### Restart

```
sudo systemctl restart bharatradar-feed
sudo systemctl restart bharatradar-mlat
```


### Systemd Status

```
sudo systemctl status bharatradar-mlat
sudo systemctl status bharatradar-feed
```


### Uninstall

```
sudo bash /usr/local/share/bharatradar/uninstall.sh
```

If the above doesn't work, you may be using an old version that didn't have the uninstall script,

just disable the services and the scripts won't run anymore:

```
sudo systemctl disable --now bharatradar-feed
sudo systemctl disable --now bharatradar-mlat
```
