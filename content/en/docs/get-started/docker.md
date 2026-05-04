---
title: "Docker Toolkit"
lead: "The bharatradar.com docker feed client is a toolkit that allows you to install, run and maintain a ADS-B / UAT / MLAT / ACARS / VDL2 feed client to a multitude of aggregators."
draft: false
images: []
type: docs
weight: 102
---

By default, it feeds MLAT+ADSB to bharatradar.com. You can enable UAT/ACARS/VDL2, and feed to your plane data to FlightRadar24, Radarbox, Piaware, [and more](https://github.com/bharatradar/feed/blob/main/.env.example)

It is designed to be run on a Raspberry Pi, but can be run on any Linux Debian-like system.

With [a few commands](#feeding-directly-to-other-aggregators), you can easily feed to other community aggregators.

## Quick Start with Docker

To get started with the docker client,

Run this **as root** on a fresh install of Raspberry Pi OS Lite or similar.

This script gets all the requirements for your system.

**For your own security,** Please consider [analysing](https://github.com/bharatradar/feed/blob/main/bin/bharatradar-init) the `bharatradar-init` script which you are about to run on your system.

```
curl -Ls https://raw.githubusercontent.com/bharatradar/feed/main/bin/bharatradar-init | bash
cd /opt/bharatradar/
cp .env.example .env
```

Then, set the environment variables.

You can either edit the `.env` file, or run `bharatradar-env set <key> <value>`

```
# Altitude in meters
bharatradar-env set FEEDER_ALT_M 542
# Latitude
bharatradar-env set FEEDER_LAT 98.76543
# Longitude
bharatradar-env set FEEDER_LONG 12.34567
# Timezone (see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
bharatradar-env set FEEDER_TZ America/New_York
# SDR Serial Number
bharatradar-env set ADSB_DONGLE_SERIAL 1090
# Site name (shows up on the MLAT map!)
bharatradar-env set MLAT_SITE_NAME "My epic site"
# Would you like to appear on mlat.bharatradar.com? Then set this:
bharatradar-env unset BHARATRADAR_MLAT_CONFIG
```

These are the minimum environment variables you need to set.

Then, run:
```
bharatradar-debug && bharatradar-up
```
Let's check if everything is working:

- [ ] <http://IP:8080> (readsb)
- [ ] <http://IP:8082> (bharatradar)
- [ ] <https://bharatradar.com> (ADSB)
- [ ] <https://mlat.bharatradar.com> (MLAT)

## Usage

By default, the client will feed to bharatradar.com.

To see the current list of supported aggregators, see the [services.txt](services.txt) file.

The `bharatradar` service supports feeding to multiple aggregators.

If you have an issue with the feed client, please [paste.ee](https://paste.ee) your error logs join our chat on [zulip](https://bharatradar.zulipchat.com)


### Restart the stack

```
bharatradar-up
```

## Enabling a service

To enable a service, run `bharatradar-service enable <service>`
To disable a service, run `bharatradar-service disable <service>`
This is a helper command that will edit the `services.txt` file, and run `bharatradar-gen` to generate a new `cmdline.txt`.

You may have to define further environment variables in the `.env` file.

Then, run `bharatradar-gen` to generate a new cmdline.txt.

The cmdline.txt is used by the bharatradar binaries to know what services to start.

Once you have done this, run `bharatradar-up` to start the containers.

## Troubleshooting

To update, run `bharatradar-update`

Running `bharatradar-debug` will tell you about common mistakes.

### I cannot find myself on the MLAT Map

bharatradar.com enables the `--privacy` flag for your MLAT client by default.
This hides you from the MLAT map.

Do you want to appear on the map? Then run:

```
bharatradar-env unset BHARATRADAR_MLAT_CONFIG && bharatradar-up
```

### Logs

- `bharatradar-logs` - view logs
- `bharatradar-logs -f` - view logs and follow

### Services
- `bharatradar-service enable <service>` - enable a service
- `bharatradar-service disable <service>` - disable a service
- `bharatradar-service list` - list all enabled services

### Environment
- `bharatradar-env list` - list all environment variables
- `bharatradar-env set <key>` - set an environment variable (also updates if it already exists)
- `bharatradar-env unset <key>` - unset an environment variable

### SDR
- `bharatradar-sdr test` - Runs rtl_test
- `bharatradar-sdr dockertest` - Runs rtl_test in a docker container
- `bharatradar-sdr dockerppm` - Runs rtl_test in a docker container with the intent to estimate the PPM

### Reset
- `bharatradar-reset` - reset the /opt/bharatradar directory

## Thank you SDR-Enthusiasts!

This would not be possible without [SDR-Enthusiasts](https://github.com/sdr-enthusiasts/) who have made [the original docker-compose](https://github.com/sdr-enthusiasts/docker-install) file.

The client is largely based off of their work plus some command line interface tools to make running the stack a bit simpler.

[Their documentation can be very useful in enabling extra feeders.](https://sdr-enthusiasts.gitbook.io/ads-b/feeder-containers/feeding-flightaware-piaware).


## Feeding directly to other aggregators

Where possible, bharatradar.com commits to share data and ingest data directly with other aggregators which are willing to license their data openly.

The `bharatradar` service can feed to other aggregators.

In this example, we feed [theairtraffic.com](https://theairtraffic.com) and [adsbexchange.com](https://adsbexchange.com)
two aggregators you might want to consider sharing your data with.

**WARNING:** ADSBexchange has recently been acquired by a private equity company with unknown plans for the data submitted. It does however have the largest MLAT network, giving you the best chance to locally identify overhead aircraft that do not explicitly share their location data.

[TheAirTraffic.com](https://theairtraffic.com) is run by [Jack Sweeney](https://grndcntrl.net/?ref=bharatradar)

This is not an endorsement and bharatradar.com/myself are not affiliated with these aggregators.

### Run

**NOTE:** This is using `--privacy`, which excludes you from bharatradar.com map, and should exclude you from other aggregators maps too.

```
bharatradar-env set BHARATRADAR_ADDITIONAL_NET_CONNECTOR "feed.adsbexchange.com,30004,beast_reduce_out;feed.theairtraffic.com,30004,beast_reduce_out"
bharatradar-env set BHARATRADAR_ADDITIONAL_MLAT_CONFIG "feed.adsbexchange.com,31090,39001,--privacy;feed.theairtraffic.com,31090,39002,--privacy"
bharatradar-env set MLATHUB_NET_CONNECTOR "bharatradar,39000,beast_in;bharatradar,39001,beast_in;bharatradar,39002,beast_in"
```
**If you would like to disable privacy mode, instead, use:**
```
bharatradar-env set BHARATRADAR_ADDITIONAL_NET_CONNECTOR "feed.adsbexchange.com,30004,beast_reduce_out;feed.theairtraffic.com,30004,beast_reduce_out"
bharatradar-env set BHARATRADAR_ADDITIONAL_MLAT_CONFIG "feed.adsbexchange.com,31090,39001;feed.theairtraffic.com,31090,39002"
bharatradar-env set MLATHUB_NET_CONNECTOR "bharatradar,39000,beast_in;bharatradar,39001,beast_in;bharatradar,39002,beast_in"
```
