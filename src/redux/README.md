# Visualizer Data Model

ParaView Visualizer use **Redux** for managing its internal state which is described below.

## Global state

```js
{
    network: {
      requests: {
        id: { message, data, ... }
      },
      pending: [],
      success: [],
      error: [],
    },
    proxies: {
      proxies: {
        '1234': { proxy }
      },
      pipeline: {
        sources: [
          { id: '123', rep: '657', name: 'Cone' }
        ],
        view: '234'
      },
      settings: {
        RenderViewSettings: '1234',
        RenderViewInteractionSettings: '3456',
      },
      available: {
        sources: [],
        filters: []
      },
      sourceToRepresentation: {
        '123': '657'
      }
    },
    active: {
      source: '234',
      representation: '567',
      view: '678'
    },
    time: {
      index: 3,
      values: [1, 2, 3, 20.3456, 40.6],
      playing: false,
    },
    files: {
      path: result
    },
    colors: {
      ranges: {
        repId: [min, max]
      },
      images: {
        repId: 'base64/img...'
      },
      scalarBars: {
        sourceId: true/false, // Visibility of scalar bar
      },
      presets: {
        repId: 'presetName',
      },
      presetImages: {
        name: 'base64/img...'
      }
    },
    ui: {  
      visiblePanel: 0, // Pipeline Browser
      collapsableState: {
        localScreenShot: true,
        screenshot: false,
        dataset: false,
        state: false,
      }
    },
    view: {
      remote: true,
      remoteFps: false,
    }
}
```

## Actions

active
colors
files
network
proxies
time
