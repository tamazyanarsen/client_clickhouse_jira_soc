exports.id = "main";
exports.modules = {

/***/ "./src/ incident/incident.controller.ts":
/*!**********************************************!*\
  !*** ./src/ incident/incident.controller.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\r\n    return function (target, key) { decorator(target, key, paramIndex); }\r\n};\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.IncidentController = void 0;\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst incident_service_1 = __webpack_require__(/*! ./incident.service */ \"./src/ incident/incident.service.ts\");\r\nconst auth_service_1 = __webpack_require__(/*! ../auth/auth.service */ \"./src/auth/auth.service.ts\");\r\nconst jwt_1 = __webpack_require__(/*! @nestjs/jwt */ \"@nestjs/jwt\");\r\nconst ld = __webpack_require__(/*! lodash */ \"lodash\");\r\nlet IncidentController = class IncidentController {\r\n    constructor(incidentService, jwtService) {\r\n        this.incidentService = incidentService;\r\n        this.jwtService = jwtService;\r\n    }\r\n    getIncidents(accessToken) {\r\n        if (auth_service_1.validateAccessToken(accessToken, this.jwtService)) {\r\n            return this.incidentService.getIncidents();\r\n        }\r\n        else {\r\n            return { status: 401 };\r\n        }\r\n    }\r\n    getIncidentsByType(accessToken) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (auth_service_1.validateAccessToken(accessToken, this.jwtService)) {\r\n                const issues = (yield this.incidentService.jira.searchJira(`project=DEBUG`, { maxResults: 2000 })).issues;\r\n                return {\r\n                    critical: issues.filter(e => e.fields.priority.name === 'High').length,\r\n                    normal: issues.filter(e => e.fields.priority.name === 'Low').length,\r\n                    warning: issues.filter(e => e.fields.priority.name === 'Medium').length,\r\n                };\r\n            }\r\n            else {\r\n                return { status: 401 };\r\n            }\r\n        });\r\n    }\r\n    getIncidentsTotal(accessToken) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (auth_service_1.validateAccessToken(accessToken, this.jwtService)) {\r\n                const issues = (yield this.incidentService.jira.searchJira(`project=DEBUG`, { maxResults: 2000 })).issues;\r\n                const date = new Date();\r\n                date.setDate(date.getDate() - 2);\r\n                return {\r\n                    perDay: issues.filter(e => new Date(e.fields.created) >= date).length,\r\n                    inProgress: issues.filter(e => e.fields.status.name.toLowerCase() === 'investigated').length,\r\n                    done: issues.filter(e => e.fields.status.name.toLowerCase() === 'false positive').length,\r\n                };\r\n            }\r\n            else {\r\n                return { status: 401 };\r\n            }\r\n        });\r\n    }\r\n    getTraffic(accessToken) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (auth_service_1.validateAccessToken(accessToken, this.jwtService)) {\r\n                const ch = new this.incidentService.ClickHouse({ host: 'srv-ch-11.int.soc.secure-soft.tech' });\r\n                const searchDate = new Date();\r\n                searchDate.setMinutes(searchDate.getMinutes() - 1);\r\n                searchDate.setHours(searchDate.getHours() + 3);\r\n                console.log('searchDate', searchDate, searchDate.getTime().toString().slice(0, -3));\r\n                const rawLimit = 5000;\r\n                const searchDateResult = searchDate.getTime().toString().slice(0, -3);\r\n                const answer = yield ch.querying(`SELECT * FROM Etanol_PROD.DataFlow_v2 WHERE DATE(FROM_UNIXTIME(time_event_sec)) > DATE(FROM_UNIXTIME(${searchDateResult})) LIMIT ${rawLimit} FORMAT JSONEachRow`);\r\n                const data = answer.split('\\n').filter(e => e.length > 0).map(e => JSON.parse(e));\r\n                console.log(data.slice(0, 5), data.length);\r\n                const result = data.map(e => new Date(parseInt(e.time_event_sec + '000', 10)));\r\n                console.log('result:', result.slice(0, 2));\r\n                return ld.groupBy(result);\r\n            }\r\n            else {\r\n                return { status: 401 };\r\n            }\r\n        });\r\n    }\r\n};\r\n__decorate([\r\n    common_1.Get(),\r\n    __param(0, common_1.Headers('authorization')),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [String]),\r\n    __metadata(\"design:returntype\", Object)\r\n], IncidentController.prototype, \"getIncidents\", null);\r\n__decorate([\r\n    common_1.Get('bytype'),\r\n    __param(0, common_1.Headers('authorization')),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [String]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], IncidentController.prototype, \"getIncidentsByType\", null);\r\n__decorate([\r\n    common_1.Get('total'),\r\n    __param(0, common_1.Headers('authorization')),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [String]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], IncidentController.prototype, \"getIncidentsTotal\", null);\r\n__decorate([\r\n    common_1.Get('traffic'),\r\n    __param(0, common_1.Headers('authorization')),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [String]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], IncidentController.prototype, \"getTraffic\", null);\r\nIncidentController = __decorate([\r\n    common_1.Controller('api/incident'),\r\n    __metadata(\"design:paramtypes\", [incident_service_1.IncidentService,\r\n        jwt_1.JwtService])\r\n], IncidentController);\r\nexports.IncidentController = IncidentController;\r\n\n\n//# sourceURL=webpack:///./src/_incident/incident.controller.ts?");

/***/ }),

/***/ "./src/ incident/incident.module.ts":
/*!******************************************!*\
  !*** ./src/ incident/incident.module.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.IncidentModule = void 0;\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst incident_service_1 = __webpack_require__(/*! ./incident.service */ \"./src/ incident/incident.service.ts\");\r\nconst incident_controller_1 = __webpack_require__(/*! ./incident.controller */ \"./src/ incident/incident.controller.ts\");\r\nconst auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ \"./src/auth/auth.module.ts\");\r\nlet IncidentModule = class IncidentModule {\r\n};\r\nIncidentModule = __decorate([\r\n    common_1.Module({\r\n        imports: [auth_module_1.AuthModule],\r\n        controllers: [incident_controller_1.IncidentController],\r\n        providers: [incident_service_1.IncidentService],\r\n    })\r\n], IncidentModule);\r\nexports.IncidentModule = IncidentModule;\r\n\n\n//# sourceURL=webpack:///./src/_incident/incident.module.ts?");

/***/ })

};