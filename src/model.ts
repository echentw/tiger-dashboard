import * as $ from 'jquery';
import { xmlToJson } from './xmlToJson';

export type NLineData = {
  NJudah: {
  },
  NOwl:{
  },
}

export class Model {
  static getCurrentTime(): string {
    const date = new Date();
    return date.toLocaleTimeString('en-Us');
  }

  static getNLineETAs(): any {
    $.ajax({
      url: 'http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=sf-muni&stopId=13911',
      success: (data: any) => {
        const json = xmlToJson(data);
        console.log(json);
        console.log(json.body.text);
      },
    });
  }
}

Model.getNLineETAs();
