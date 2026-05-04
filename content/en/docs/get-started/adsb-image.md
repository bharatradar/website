---
title: "ADSB.im Image"
lead: "Use ADSB.im feeder image as an alternative setup method."
draft: false
images: []
type: docs
weight: 105
---

> **Prefer a simpler setup?** Use our [one-line feeder installer](../become-a-feeder/) instead — it's faster and requires no manual configuration.

The [ADSB.im](https://adsb.im) feeder image is a pre-built Raspberry Pi image with readsb and multiple aggregator feeds pre-configured.

This image is made and maintained by [dirkhh](https://github.com/dirkhh/adsb-feeder-image) with contributions from [myself](https://github.com/katlol).

Please follow the [detailed instructions](https://adsb.im/howto) on the ADSB.im website.

## Feeding to BharatRadar with ADSB.im

Once ADSB.im is installed and running, add BharatRadar as a feeder:

1. Go to the ADSB.im web interface at `http://<pi-ip>/`
2. Navigate to **Aggregators** → **Add Aggregator**
3. Enter `feed.bharatradar.com` as the server
4. Save and restart the feeder services

Your data will start appearing on [map.bharatradar.com](https://map.bharatradar.com) within a few minutes.
