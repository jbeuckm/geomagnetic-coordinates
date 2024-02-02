## geomagnetic-coords

Dependency-free geomagnetic<-->geographic coordinate transformer based on https://idlastro.gsfc.nasa.gov/ftp/pro/astro/geo2mag.pro

Usage:

```
import { geo2mag } from 'geomagnetic-coords'

const magPos = geo2mag({ latitude:45, longitude:-93 })
// magPos ~ { latitude: 53.511, longitude: -24.486 }
```
