---
title: "Become a Feeder"
description: "Set up your own ADS-B receiver and help expand BharatRadar's coverage across India."
lead: "All you need is a Raspberry Pi, an RTL-SDR dongle, and an antenna. Setup takes under 15 minutes."
date: 2026-05-05T01:00:00+05:30
lastmod: 2026-05-05T01:00:00+05:30
draft: false
images: []
menu:
  docs:
    parent: "get-started"
    identifier: "become-a-feeder"
weight: 101
toc: true
---

## What You Need

Setting up a feeder requires minimal hardware. Here's what you need to get started:

| Component | Details | Price |
|---|---|---|
| **Raspberry Pi 4** (2GB+) | Any model works. Pi 3 is also fine. | ~$45 USD (~₹4,000 INR) |
| **RTL-SDR Blog v4** | The most popular SDR for ADS-B. RTL2832U based. | ~$35 USD (~₹3,000 INR) |
| **1090 MHz Antenna** | A basic PCB antenna works to start. Upgrade later for better range. | ~$15 USD (~₹1,500 INR) |
| **MicroSD Card** (8GB+) | Raspberry Pi OS Lite. | ~$8 USD (~₹700 INR) |
| **Power Supply** | Official Pi power supply recommended. | ~$10 USD (~₹900 INR) |

**Total: from ~$113 USD (~₹10,100 INR)**

> **Note:** A better antenna (Vinnant, Sirio, or DPD Productions) will dramatically improve your range. Plan for ₹3,000–₹15,000 more if you want serious coverage. See our [equipment guide](../hardware/adsb-equipment/) for recommendations.

## One-Line Install

The fastest way to get started. Just run this on your Raspberry Pi:

```bash
curl -Ls https://raw.githubusercontent.com/bharatradar/infra/main/scripts/bharatradar-feeder | sudo bash
```

That's it. The installer will:

1. **Detect your SDR** — automatically finds RTL-SDR, Airspy, or HackRF devices
2. **Check for existing software** — if you already have readsb/tar1090 installed, it offers to reconfigure instead of replacing
3. **Install readsb** — builds from wiedehopf's fork with your specific SDR support
4. **Install mlat-client** — for multilateration support
5. **Create systemd services** — three services that auto-start on boot
6. **Connect to our server** — sends ADS-B and MLAT data to `feed.bharatradar.com`

## What the Installer Does

### SDR Auto-Detection

The installer scans USB for known SDR devices:

| USB ID | Device | Mode |
|---|---|---|
| `0bda:2832` / `0bda:2838` | RTL-SDR v2/v3/v4 | `rtlsdr` |
| `1d50:60a1` | Airspy Mini / R2 | `airspy` |
| `1d50:60a1` (HF+ in name) | Airspy HF+ | `airspyhf` |
| `1d50:6089` | HackRF One | `hackrf` |

If no SDR is detected, you can still run in **feeder-only mode** to forward data from an existing readsb on your network.

### Existing Software Detection

If you already have ADS-B software installed, the installer asks what you want:

| Option | What It Does |
|---|---|
| **Reconfigure** | Adds BharatRadar as a feeder to your existing readsb. No disruption. |
| **Fresh Install** | Installs a separate readsb build alongside your existing setup. |
| **Feeder Only** | Skips readsb entirely. Only creates the feeder bridge and MLAT client. |

### Services Created

Three systemd services are created and enabled:

| Service | Purpose |
|---|---|
| `bharatradar-readsb` | Decodes ADS-B signals from your SDR |
| `bharatradar-feeder` | Bridges beast data to `feed.bharatradar.com:30004` |
| `bharatradar-mlat` | Runs mlat-client to `feed.bharatradar.com:31090` |

### Auto-Fixes

The installer also:
- Blacklists the `dvb_usb_rtl28xxu` kernel driver (common RTL-SDR conflict)
- Generates a unique feeder UUID (saved to `/etc/bharat-radar-id`)
- Detects your location from your public IP as a starting point

## Configuration Wizard

During install, you'll be asked for:

1. **Latitude** — your receiver's GPS latitude (auto-detected from IP as default)
2. **Longitude** — your receiver's GPS longitude
3. **Altitude** — antenna height above sea level in meters
4. **Feeder Name** — what shows on the MLAT map (auto-generated from UUID)
5. **MLAT Map Visibility** — whether to show your feeder publicly (default: visible)

## After Installation

### Check Status

```bash
sudo systemctl status bharatradar-feeder
sudo systemctl status bharatradar-mlat
sudo systemctl status bharatradar-readsb
```

### View Logs

```bash
sudo journalctl -u bharatradar-feeder -f
sudo journalctl -u bharatradar-mlat -f
```

### Your Feeder Map

Once data starts flowing (usually within 2-3 minutes), visit:

- **Your personalized map:** `https://my.bharatradar.com`
- **Public live map:** `https://map.bharatradar.com`
- **MLAT coverage map:** `https://mlat.bharatradar.com`

### Local Map

If readsb is installed, you also get a local tar1090 map at:

```
http://<your-pi-ip>:8080/
```

## Troubleshooting

### No SDR Detected

Make sure your RTL-SDR is plugged in and visible:

```bash
lsusb
```

You should see a line with `Realtek Semiconductor Corp. RTL2838` or similar. If not, try a different USB port.

### Blacklist Fix Didn't Work

If readsb can't find the SDR, the kernel driver might still be loaded:

```bash
lsmod | grep dvb_usb
```

If you see `dvb_usb_rtl2832u` or `rtl2832`, unload it:

```bash
sudo rmmod dvb_usb_rtl2832u
sudo rmmod rtl2832
```

Then restart:

```bash
sudo systemctl restart bharatradar-readsb
```

### Feeder Not Showing on MLAT Map

MLAT requires at least 3 receivers with overlapping coverage to triangulate positions. With only one feeder, the map will show `"peers": {}` — this is normal. As more feeders join in your area, your MLAT position data will appear.

### Check if Data Is Reaching the Server

```bash
# On your Pi — check feeder is connected
sudo journalctl -u bharatradar-feeder --since "1 min ago"

# Check MLAT client sync
sudo journalctl -u bharatradar-mlat --since "1 min ago"
```

### Reconfigure

To change your settings later:

```bash
curl -Ls https://raw.githubusercontent.com/bharatradar/infra/main/scripts/bharatradar-feeder | sudo bash
```

The installer will detect your existing config and let you reconfigure.

## Need Help?

- **GitHub:** [bharatradar/infra](https://github.com/bharatradar/infra)
- **Issues:** [Report a bug](https://github.com/bharatradar/infra/issues)
