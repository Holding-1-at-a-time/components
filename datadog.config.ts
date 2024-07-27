import { datadogRum } from "@datadog/browser-rum";

datadogRum.init({
    applicationId: "778911bc-20cc-4a35-a24c-58e9b15f1a25",
    clientToken: "puba4efeb3da77c1a840dba37b306519d08",
    // `site` refers to the Datadog site parameter of your organization
    // see https://docs.datadoghq.com/getting_started/site/
    site: "us5.datadoghq.com",
    service: "user-collection",
    env: "development ",
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: "1.0.0", 
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: "allow",
});

datadogRum.startSessionReplayRecording();

datadogRum.init({
    applicationId: '778911bc-20cc-4a35-a24c-58e9b15f1a25',
    clientToken: 'puba4efeb3da77c1a840dba37b306519d08',
    // `site` refers to the Datadog site parameter of your organization
    // see https://docs.datadoghq.com/getting_started/site/
    site: 'us5.datadoghq.com',
    service: 'user-collection',
    env: 'development ',
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0', 
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'allow',
});