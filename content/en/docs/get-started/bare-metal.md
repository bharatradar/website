---
title: "Bare Metal"
lead: "Using your existing ADS-B receiver to feed BharatRadar"
draft: false
images: []
type: docs
weight: 103
---

> **Recommended:** Use the [one-line feeder installer](../become-a-feeder/) — it auto-detects your hardware and handles everything below automatically.

If you already have an ADS-B receiver running readsb (from ADSB.im, Wiedehopf's scripts, or any other method), you can add BharatRadar as a feeder without disrupting your existing setup.

## Quick Start

Run this on your existing receiver:

```bash
curl -Ls https://raw.githubusercontent.com/bharatradar/infra/main/scripts/bharatradar-feeder | sudo bash
```

The installer will detect your existing readsb and offer to reconfigure it, or install fresh alongside.

## Manual Setup

### 1: Find coordinates / elevation

<https://www.freemaptools.com/elevation-finder.htm>

### 2: Add BharatRadar to your readsb

If your readsb uses `/etc/default/readsb`, add the feeder connector to `NET_OPTIONS`:

```
--net-connector feed.bharatradar.com,30004,beast_reduce_plus_out
```

Then restart readsb:

```bash
sudo systemctl restart readsb
```

### 3: Install mlat-client

```bash
# Clone and build
git clone --depth 1 https://github.com/wiedehopf/mlat-client.git /tmp/mlat-client
cd /tmp/mlat-client && make -j$(nproc)
sudo cp mlat-client /usr/local/bin/mlat-client
cd / && rm -rf /tmp/mlat-client
```

### 4: Create the MLAT service

```bash
sudo tee /etc/systemd/system/bharatradar-mlat.service << 'EOF'
[Unit]
Description=BharatRadar MLAT Client
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/mlat-client \
  --input-type beast \
  --input-connect 127.0.0.1:30005 \
  --server feed.bharatradar.com:31090 \
  --user BR-YOUR_UUID_HERE \
  --lat YOUR_LAT \
  --lon YOUR_LON \
  --alt YOUR_ALT_M
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now bharatradar-mlat
```

Replace `BR-YOUR_UUID_HERE`, `YOUR_LAT`, `YOUR_LON`, and `YOUR_ALT_M` with your values.

## Check if Your Feed Is Working

Visit [map.bharatradar.com](https://map.bharatradar.com) — you should see aircraft from your receiver within a few minutes.

### Optional: Local Interface

If you don't already have a local readsb map, you can install one:

```bash
# Install/update
sudo bash /usr/local/share/bharatradar/git/install-or-update-interface.sh

# Remove
sudo bash /usr/local/share/tar1090/uninstall.sh bharatradar
```

## Misc Maintenance

### Update

```bash
curl -L -o /tmp/lol-update.sh https://raw.githubusercontent.com/bharatradar/feed/master/update.sh
sudo bash /tmp/lol-update.sh
```

### Troubleshooting

If you encounter issues, provide these logs on [Zulip](https://bharatradar.zulipchat.com):

```bash
sudo journalctl -u bharatradar-feed --no-pager
sudo journalctl -u bharatradar-mlat --no-pager
```

### Display Configuration

```bash
cat /etc/default/bharatradar
```

### Restart

```bash
sudo systemctl restart bharatradar-feed
sudo systemctl restart bharatradar-mlat
```

### Systemd Status

```bash
sudo systemctl status bharatradar-mlat
sudo systemctl status bharatradar-feed
```

### Uninstall

```bash
sudo bash /usr/local/share/bharatradar/uninstall.sh
```

If the above doesn't work, you may be using an old version:

```bash
sudo systemctl disable --now bharatradar-feed
sudo systemctl disable --now bharatradar-mlat
```
