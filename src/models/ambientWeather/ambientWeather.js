// @flow
import Models            from '../';
import AmbientWeatherApi from 'ambient-weather-api'; // https://ambientweather.docs.apiary.io/#reference/ambient-realtime-api

export type AWOptions = {
  apiKey: string,
  applicationKey: string
};

class AmbientWeather {
  ambientWeatherApi: AmbientWeatherApi;

  constructor(models: Models, ambientWeatherOptions: AWOptions) {
    this.models  = models;
    this.ambientWeatherApi = new AmbientWeatherApi({
      apiKey: process.env.WEATHER_API || ambientWeatherOptions.apiKey,
      applicationKey: process.env.WEATHER_APP_API || ambientWeatherOptions.applicationKey
    });
    this.ambientWeatherApi.on('connect', () => {
      console.log('Connected to Ambient Weather Realtime API.');
      if (this._onWeatherConnect)
        this._onWeatherConnect();
    });
    this.ambientWeatherApi.on('data', device => {
      if (this._onWeatherUpdate)
        this._onWeatherUpdate(device);
    });
    this.ambientWeatherApi.on('subscribed', subscriptions => {
      if (this._onSubscriptionUpdate)
        this._onSubscriptionUpdate(subscriptions);
    });
  }

  _connect() {
    this.ambientWeatherApi.connect();
  }

  _disconnect() {
    this.ambientWeatherApi.disconnect();
  }

  _subscribe(apiKeys: Array<string> | string) {
    this.ambientWeatherApi.subscribe(apiKeys);
  }

  _unsubscribe(apiKeys: Array<string> | string) {
    this.ambientWeatherApi.unsubscribe(apiKeys);
  }

  _devices(): Promise {
    return this.ambientWeatherApi.userDevices();
  }

  _deviceData(macAddress: string): Promise {
    return this.ambientWeatherApi.deviceData(macAddress);
  }
}

export default AmbientWeather;

// example 'on data'
// weather update { dateutc: 1552890180000,
//   winddir: 326,
//   windspeedmph: 0,
//   windgustmph: 0,
//   maxdailygust: 1.1,
//   tempf: 32.5,
//   hourlyrainin: 0,
//   eventrainin: 0,
//   dailyrainin: 0,
//   weeklyrainin: 0,
//   monthlyrainin: 0,
//   totalrainin: 0,
//   baromrelin: 29.87,
//   baromabsin: 29.84,
//   humidity: 98,
//   tempinf: 64.4,
//   humidityin: 51,
//   uv: 0,
//   solarradiation: 0,
//   feelsLike: 32.5,
//   dewPoint: 32,
//   date: '2019-03-18T06:23:00.000Z',
//   macAddress: '00:00:00:00:00:00',
//   device:
//    { macAddress: '00:00:00:00:00:00',
//      lastData:
//       { dateutc: 1552884120000,
//         winddir: 326,
//         windspeedmph: 0,
//         windgustmph: 0,
//         maxdailygust: 0,
//         tempf: 34.5,
//         hourlyrainin: 0,
//         eventrainin: 0,
//         dailyrainin: 0,
//         weeklyrainin: 0,
//         monthlyrainin: 0,
//         totalrainin: 0,
//         baromrelin: 29.89,
//         baromabsin: 29.86,
//         humidity: 89,
//         tempinf: 65.3,
//         humidityin: 52,
//         uv: 0,
//         solarradiation: 0,
//         feelsLike: 34.5,
//         dewPoint: 31.6,
//         deviceId: 'numbersAndLetters',
//         date: '2019-03-18T04:42:00.000Z' },
//      info: { name: 'First Weather Station', location: 'Home' },
//      apiKey:
//       'blahblahblahblahblahblahblahblahblahblahblahblah' } }
