import { Component, OnInit } from '@angular/core';
import { GatewayService } from 'src/_service/gateway.service';
import { PlantsService } from 'src/_service/plants.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'home-controller';

  public serverStatus: 'ONLINE' | 'OFFLINE' = 'OFFLINE';
  public onlineMS: any = [];
  public offlineMS: any = [];

  public plantsMicroservice: any = {status: 'ko', response: 'off'};

  constructor(
    private gatewayService: GatewayService,
    private plantsService: PlantsService,
  ) { }

  ngOnInit() {
    this.getServerStatus();
    setInterval(() => { this.getServerStatus() }, 60*1000);
  }

  private getServerStatus() {
    return this.gatewayService.getServerStatus()
      .subscribe((resultObj: any) => {
        console.log("[Server status]", resultObj);
        this.serverStatus = (resultObj && resultObj.status === 'ok') ? 'ONLINE' : 'OFFLINE';

        if (this.serverStatus === 'ONLINE') {
          this.getOnlineMs();
          this.getOfflineMs();
        }
      });
  }

  private getOnlineMs() {
    return this.gatewayService.getOnlineMs()
      .subscribe((resultObj: any) => {
        console.log("[OnlineMS]", resultObj);
        this.onlineMS = resultObj.response;

        this.onlineMS.forEach((currMsObj: any) => {
          if (currMsObj.name === 'plants-microservice') {
            this.plantsService.setPlantsUrl(currMsObj.ip);
            this.plantsService.getPlantsStatus()
              .subscribe((resultObj: any) => {
                this.plantsMicroservice = resultObj;
              });
          }
        });
      });
  }

  private getOfflineMs() {
    return this.gatewayService.getOfflineMs()
      .subscribe((resultObj: any) => {
        console.log("[OfflineMS]", resultObj);
        this.offlineMS = resultObj.response;
      });
  }

  isPlantsMsOnline() {
    return this.plantsMicroservice.status === 'ok';
  }
  
  isPlantsMsActive() {
    return this.plantsMicroservice.response === 'on';
  }

  onOpenPlantsMs() {
    this.plantsService.openPlants()
      .subscribe((resultObj: any) => {
        if (resultObj && resultObj.status === 'ok' && resultObj.response === 'on') {
          this.plantsMicroservice = resultObj;
          console.log('Rubinetto aperto');
        }
      });
  }

  onClosePlantsMs() {
    this.plantsService.closePlants()
      .subscribe((resultObj: any) => {
        if (resultObj && resultObj.status === 'ok' && resultObj.response === 'off') {
          this.plantsMicroservice = resultObj;
          console.log('Rubinetto chiuso');
        }
      });
  }
}
