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

  public plantsMicroservice: any = {status: 'ko', response: 0};

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
        this.serverStatus = resultObj.status === 'ok' ? 'ONLINE' : 'OFFLINE';

        if (this.serverStatus === 'ONLINE') {
          this.getOnlineMs();
          this.getOfflineMs();

          this.onlineMS.forEach((currMsObj: any) => {
            if (currMsObj.name === 'plants-microservice') {
              this.plantsService.setPlantsUrl(currMsObj.ip);
            }
          });
        }
      });
  }

  private getOnlineMs() {
    return this.gatewayService.getOnlineMs()
      .subscribe((resultObj: any) => {
        console.log("[OnlineMS]", resultObj);
        this.onlineMS = resultObj.response;
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
    return this.plantsMicroservice.status !== 'ok';
  }
  
  isPlantsMsActive() {
    return this.plantsMicroservice.response === '1';
  }

  onOpenPlantsMs() {
    this.plantsService.openPlants();
    console.log('apri rubinetto');
  }

  onClosePlantsMs() {
    this.plantsService.closePlants();
    console.log('chiudi rubinetto');
  }
}
