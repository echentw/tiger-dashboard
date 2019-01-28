import * as $ from 'jquery';

export type ETA = {
  absoluteTimeSeconds: number,
  relativeTimeSeconds: number,
};

export type NLineData = {
  NJudah: {
    predictions: ETA[];
  };
  NOwl: {
    predictions: ETA[];
  };
};

export class Model {
  static getCurrentTime(): string {
    const date = new Date();
    return date.toLocaleTimeString('en-Us');
  }

  static _extractPredictions(predictions: any): ETA[] {
    const etas: ETA[] = [];
    for (let i = 0; i < predictions.length; ++i) {
      const elem: any = predictions[i];
      etas.push({
        absoluteTimeSeconds: Number(elem.getAttribute('epochTime')),
        relativeTimeSeconds: Number(elem.getAttribute('seconds')),
      });
    }
    return etas;
  }

  static getNLineETAs(): Promise<NLineData> {
    return new Promise((resolve: (data: NLineData) => void) => {
      $.ajax({
        url: 'http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=sf-muni&stopId=13911',
        success: (data: XMLDocument) => {
          let predictionsJudah: any;
          let predictionsOwl: any;
          try {
            predictionsJudah = data
              .getElementsByTagName('predictions')[0]
              .getElementsByTagName('direction')[0]
              .getElementsByTagName('prediction');
          } catch(e) {
            predictionsJudah = [];
          }
          try {
            predictionsOwl = data
              .getElementsByTagName('predictions')[1]
              .getElementsByTagName('direction')[0]
              .getElementsByTagName('prediction');
          } catch(e) {
            predictionsOwl = [];
          }

          return resolve({
            NJudah: {
              predictions: Model._extractPredictions(predictionsJudah),
            },
            NOwl: {
              predictions: Model._extractPredictions(predictionsOwl),
            },
          });
        },
      });
    });
  }
}

Model.getNLineETAs();
