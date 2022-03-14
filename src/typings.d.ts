declare var processOSM: Process;

interface Process {
    env: Env
}



interface Env {
    MAPBOX_TOKEN: string;
    API_URL: string;
    LOCATIONIQ_TOKEN: string;
}

interface GlobalEnvironment{
    processOSM: Process;
}
