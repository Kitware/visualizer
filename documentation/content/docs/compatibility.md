title: Version Compatibility
---
ParaViewWeb Visualizer depends on ParaView, which can be downloaded [here](http://www.paraview.org/download/).
The table below indicates which versions of ParaView and Visualizer work together.

| ParaView | Visualizer in PV binary   |              Visualizer              |
|:--------:|:-------------------------:|:------------------------------------:|
| 5.2      | 2.0.16                    | <= 2.0.17                            |
| 5.3      | 2.0.18                    | broken on Linux, otherwise <= 2.0.20 |
| 5.4      | 2.1.4                     | <= 2.2.0                             |
| 5.5.2    | 3.1.4 (Issue - see below) | <= 3.1.4                             |
| 5.6      | 3.1.10                    | <= master                            |
| master   | 3.1.10                    | <= master                            |

## ParaView 5.5.2 - Bundle issue

The version of Visualizer inside ParaView 5.5.2 is not compatible. Please follow the below instructions to make the client compatible with the core of ParaView. 

For that you will need to edit the following file.

```
Windows
ParaView-5.5.2-Qt5-Windows-64bit\share\paraview-5.5\web\visualizer\server\pvw-visualizer.py
```

```
Linux
ParaView-5.5.2-Qt5-MPI-Linux-64bit/share/paraview-5.5/web/visualizer/server/pvw-visualizer.py
```

```
macOS
ParaView-5.5.2.app/Contents/Resources/web/visualizer/server/pvw-visualizer.py
```

Replace Line 195
```
self.registerVtkWebProtocol(pv_protocols.ParaViewWebColorManager(pathToColorMaps=_VisualizerServer.colorPalette, showBuiltin=_VisualizerServer.showBuiltin))
```
with
```
self.registerVtkWebProtocol(pv_protocols.ParaViewWebColorManager(pathToColorMaps=_VisualizerServer.colorPalette))
```

Basically the extra `showBuiltin` argument needs to be removed as the server does not know how to handle it yet. (ParaView/master does)

## How to upgrade an existing ParaView

This section provide an alternative approach which could allow you to use an existing working ParaView installation and upgrade it to leverage the newest capability of ParaViewWeb/Visualizer.

To do that, you will need to replace a set of Python files (which you should keep as backup if any issue arise).

On a side you should download the following set of files from [Gitlab](https://gitlab.kitware.com/paraview/paraview/tree/master/Web/Python/paraview/web) or [Github](https://github.com/Kitware/ParaView/tree/master/Web/Python/paraview/web).

Usually only `protocols.py` is required but sometime we do update `decorators.py` as well. In any case, if you want to be safe you can replace the full content of that directory.

And those new files should be placed in the following directory depending on which platform you are doing the modifications.


```
Windows 
ParaView-5.x.x-Qt5-Windows-64bit/bin/Lib/site-packages/paraview/web
```

```
Linux
ParaView-5.x.x-Qt5-MPI-Linux-64bit/lib/python2.7/site-packages/paraview/web
```

```
macOS
ParaView-5.x.x.app/Contents/Python/paraview/web
```
