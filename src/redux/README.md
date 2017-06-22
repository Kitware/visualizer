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
      listings: {
        path: listing,
      },
      activePath: path,
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
      },
      piecewiseFunctions: {
        arrayName: points,
      },
      piecewiseFunctionsToPush: {
        arrayName: points, // server side format
      },
    },
    save: {
      statuses: {
        screenshot: 'pending' | 'success' | 'error',
        state: 'pending' | 'success' | 'error',
        dataset: 'pending' | 'success' | 'error',
      },
      paths: {
        screenshot: 'server-images/savedScreen.png',
        state: 'server-state/savedState.pvsm',
        dataset: 'server-data/savedDataset.vtk',
      },
    },
    ui: {  
      visiblePanel: 0, // Pipeline Browser
      collapsableState: {
        localScreenShot: true,
        screenshot: false,
        dataset: false,
        state: false,

        Source: false,         // Open
        Representation: true,  // Closed
        View: true,            // Closed
        RenderViewSettingsCollapsed: false, // Open

        collapsibleGroups: {
          '596:DataAxesGrid': true,   // Open (FIXME: meaning should eventually match above)
          '317:PolarAxesGrid': false, // Closed
        },
      }
    },
    view: {
      remote: true,       // doing remote rendering (false means local via vtk.js)
      remoteFps: false,   // show remote rendering statistics 
    }
}
```

## Actions

Actions are defined in file within the `src/redux/ducks/` directory:

| Actions file |                           Purpose                            |
|:------------:|--------------------------------------------------------------|
| active       | Active source, representation and view                       |
| colors       | Scalar bars, lookup table preset, piecewise functions, etc   |
| files        | Server side directory listings and files                     |
| network      | Network requests (rpc calls) and their state                 |
| proxies      | Pipeline (sources, filters) as well as representation        |
| save         | Saved data locations and success/failure/pending status      |
| time         | Available time step values and current time index            |
| ui           | Panel visibility and collapsible state of property grouping  |
| view         | Local vs. remote rendering, rendering performance            |
