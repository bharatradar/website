---
title: "Introduction"
description: "BharatRadar is a community-driven flight tracking network that aggregates ADS-B data from volunteer feeders around the world."
lead: "BharatRadar is a community-driven flight tracking network that aggregates ADS-B data from volunteer feeders around the world."
date: 2023-06-27T22:25:19+02:00
lastmod: 2026-05-05T08:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: "overview"
    identifier: "introduction-overview"
weight: 010
toc: true
---

## How It Works

Aircraft broadcast their position, altitude, speed, and other data via **ADS-B** (Automatic Dependent Surveillance–Broadcast) on 1090 MHz. Anyone with a cheap USB radio (SDR) and an antenna can receive these signals and feed them to the network.

```
  Aircraft  ──1090 MHz──►  Your SDR  ──Internet──►  BharatRadar  ──►  Live Map
```

Your feeder sends raw beast-format data to our ingest servers. We aggregate data from all feeders, run MLAT calculations for aircraft that only transmit position via other means, and display everything on the live map.

## Why Feed?

- **See your local airspace** — Get a personal map showing every aircraft your receiver picks up
- **Help build a free, open network** — All data is open (ODbL 1.0) for researchers, enthusiasts, and developers
- **Join a community** — Connect with other feeders, share tips, and improve reception
- **It's free** — No cost to feed, no data cap, no strings attached

## What You Need

| Item | Minimum | Recommended |
|------|---------|-------------|
| Computer | Raspberry Pi 3 / old laptop | Raspberry Pi 4 / Pi 5 |
| SDR | RTL-SDR Blog V3 (~$30) | Airspy Mini (~$99) |
| Antenna | Simple dipole (included) | Dedicated ADS-B antenna |
| Connection | WiFi (basic) | Ethernet (stable) |

## Quick Start

**New to ADS-B?** Follow the [Become a Feeder](../get-started/become-a-feeder/) guide — one command installs everything.

**Already running a receiver?** See [Bare Metal setup](../get-started/bare-metal/) to add BharatRadar alongside your existing feeders.

## Network Features

- **Live Map** — Real-time aircraft positions with no filtering
- **MLAT** — Multilateration for aircraft without ADS-B out
- **My Map** — Personal dashboard showing only aircraft your feeder sees
- **Open Data** — Historical data dumps and REST API
- **No Filter** — We show everything, including military and special interest aircraft
