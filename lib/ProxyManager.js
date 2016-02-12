import Monologue from 'monologue.js';

// ----------------------------------------------------------------------------

const TOPICS = {
    ACTIVE_PROXY_CHANGE: 'pvw.proxymanager.active.proxy.change',
    TIME_CHANGE:         'pvw.proxymanager.time.change',
    PIPELINE_CHANGE:     'pvw.proxymanager.pipeline.change',
};

// ----------------------------------------------------------------------------

function updateTimeInformation(self) {
    self.client.TimeHandler.getTimeValues()
        .then(
            timeValues => {
                self.time = timeValues;
                if(timeValues.length) {
                    self.client.TimeHandler.getTimeStep()
                        .then(
                            timeStep => {
                                self.timestep = timeStep;
                                self.emit(TOPICS.TIME_CHANGE, {timeStep, timeValues});
                            },
                            err => {
                                console.log('Error fetching current timestep', err);
                            });
                } else {
                    self.emit(TOPICS.TIME_CHANGE, {timeStep: 0, timeValues});
                }
            },
            ko => {
                self.time = [];
                self.timestep = 0;
                console.log('Error fetching time information');
            })
}

// ----------------------------------------------------------------------------

export default class ProxyManager {

    constructor(client) {
        this.client = client;
        this.activeProxyId = '0';
        this.sourceList = [];
        this.filterList = [];
        this.timestep = 0;
        this.time = [];

        // File time information
        updateTimeInformation(this);

        // Keep track of any server notification
        client.session.subscribe("pv.time.change", (args) => {
            const timeStep = args[0].timeStep;
            const timeValues = this.time;
            this.timestep = timeStep;
            this.emit(TOPICS.TIME_CHANGE, { timeStep, timeValues });
        });

        // Fill source/filter data
        client.ProxyManager.availableSources()
            .then(
                sources => {
                    this.sourceList = sources;
                },
                err => {
                    console.log('Error fetching sources', err);
                });

        client.ProxyManager.availableFilters()
            .then(
                filters => {
                    this.filterList = filters;
                },
                err => {
                    console.log('Error fetching filters', err);
                });
    }

    // --- Active Proxy handling ---

    getActiveProxyId() {
        return this.activeProxyId;
    }

    hasActiveProxy() {
        return (this.activeProxyId && this.activeProxyId !== '' && this.activeProxyId !== '0' && this.activeProxyId !== '-1');
    }

    setActiveProxyId(id) {
        this.activeProxyId = id;
        this.emit(TOPICS.ACTIVE_PROXY_CHANGE, id);
    }

    onActiveProxyChange(callback) {
        return this.on(TOPICS.ACTIVE_PROXY_CHANGE, callback);
    }

    // --- Source/Filter handling ---

    getSources() {
        return this.sourceList;
    }


    getFilters() {
        return this.filterList;
    }

    canApplyFilter() {
        return this.hasActiveProxy();
    }

    // --- Time handling ---

    setTimeStep(idx) {
        const initialValue = this.timestep;
        if(this.timestep !== idx) {
            this.timestep = idx % this.time.length;

            if(this.timestep !== initialValue) {
                const { timestep, time } = this;

                return this.client.TimeHandler.setTimeStep(timestep)
                    .then(
                        ok => {
                            this.emit(TOPICS.TIME_CHANGE, { timeStep:timestep, timeValues:time });
                        },
                        ko => {
                            console.log('Error setting timestep', ko);
                        });
            }
        }
        return new Promise((ok,ko) => { ko(); });
    }

    getTimeStep() {
        return this.timestep;
    }

    getTimeValues() {
        return this.time;
    }

    onTimeChange(callback) {
        return this.on(TOPICS.TIME_CHANGE, callback);
    }

    playTime(delatT=0.01) {
        return this.client.TimeHandler.play(delatT);
    }

    stopTime() {
        return this.client.TimeHandler.stop();
    }

    // --- View Management ---

    resetCamera() {
        this.client.ViewPort.resetCamera();
    }


    // --- Network adapter ---

    getNetworkAdapter() {
        const client = this.client,
            connection = client.connection,
            session = client.session;
        return { client, connection, session };
    }

    // --- Remote File Management ---

    listServerDirectory(path) {
        return this.client.FileListing.listServerDirectory(path);
    }

    open(files) {
        return this.client.ProxyManager.open(files)
            .then(proxy => {
                updateTimeInformation(this);
                this.setActiveProxyId(proxy.id);
                this.emit(TOPICS.PIPELINE_CHANGE, proxy);
            });
    }

    // --- Proxy Handling ---

    onPipelineChange(callback) {
        return this.on(TOPICS.PIPELINE_CHANGE, callback);
    }

    createProxy(algo, parent=this.activeProxyId) {
        return this.client.ProxyManager.create(algo, parent)
            .then(proxy => {
                updateTimeInformation(this);
                this.setActiveProxyId(proxy.id);
                this.emit(TOPICS.PIPELINE_CHANGE, proxy);
            });
    }

    deleteProxy(id) {
        return this.client.ProxyManager.delete(id)
            .then((parent) => {
                updateTimeInformation(this);
                this.setActiveProxyId(parent.id);
                this.emit(TOPICS.PIPELINE_CHANGE, null);
            });
    }

    getProxy(id) {
        return this.client.ProxyManager.get(id);
    }

    listProxies() {
        return this.client.ProxyManager.list();
    }

    updateProperties(propertyChangeSet) {
        return this.client.ProxyManager.update(propertyChangeSet);
    }
}
Monologue.mixInto(ProxyManager);
