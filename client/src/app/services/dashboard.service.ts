import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor(private http: HttpClient) {
    }

    getIncidentsByType() {
        return this.http.get(environment.url + '/api/incident/bytype');
    }

    getIncidentsTotal() {
        return this.http.get(environment.url + '/api/incident/total');
    }

    getTraffic() {
        return this.http.get(environment.url + '/api/incident/traffic');
    }

    getAllTraffic() {
        return this.http.get(environment.url + '/api/incident/alltraffic');
    }
}
