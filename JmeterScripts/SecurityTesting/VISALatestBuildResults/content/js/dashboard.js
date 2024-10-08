/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 3.6923076923076925, "KoPercent": 96.3076923076923};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.026153846153846153, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "MenuItemSave-Admin-/api/menuitem/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/analyticsdashboard/save"], "isController": false}, {"data": [0.0, 500, 1500, "api/legal/agreement/save"], "isController": false}, {"data": [0.5, 500, 1500, "api/jobtype/save"], "isController": false}, {"data": [0.0, 500, 1500, "AssetSave-Admin-api/asset/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/passsecpolicy/save"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "api/system/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/mitigationcontrol/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/badgedesigner/save"], "isController": false}, {"data": [0.0, 500, 1500, "api/systemtype/save"], "isController": false}, {"data": [0.0, 500, 1500, "AccessSave-Admin-/api/access/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/request/save?"], "isController": false}, {"data": [0.0, 500, 1500, "/api/recipient/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/policygroup/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/adjunctacr/syncrequesttype/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/responsecodetype/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/reconconfig/save"], "isController": false}, {"data": [0.0, 500, 1500, "AccessGroupTypeSave-Admin-/api/accessgrouptype/save"], "isController": false}, {"data": [0.0, 500, 1500, "PreRequisiteSave-Admin-/api/prerequisite/save?"], "isController": false}, {"data": [0.0, 500, 1500, "AccessTypeSave-Admin-/api/accesstype/save"], "isController": false}, {"data": [0.0, 500, 1500, "AnalyticsSave-Admin-/api/analytics/save"], "isController": false}, {"data": [0.0, 500, 1500, "Organisation&OrgTypeSave-Admin-/api/organisationtype/save?"], "isController": false}, {"data": [0.0, 500, 1500, "WorkflowSave-Admin-/api/workflow/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/delegation/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/admin/auth/reset"], "isController": false}, {"data": [0.0, 500, 1500, "AssetTypeSave-Admin-/api/assettype/save"], "isController": false}, {"data": [0.5, 500, 1500, "ActionSave-Admin-/api/action/save"], "isController": false}, {"data": [0.0, 500, 1500, "MenuItemSave-Admin-/api/menuitem/save---NOTTESTED"], "isController": false}, {"data": [0.0, 500, 1500, "IdentitySave-Admin-api/identity/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/lists/save"], "isController": false}, {"data": [0.0, 500, 1500, "LocationSave-Admin-/api/location/save"], "isController": false}, {"data": [0.0, 500, 1500, "VisitTypeSave-Admin-/api/tpmadmin/visittype/save"], "isController": false}, {"data": [0.0, 500, 1500, "AccessGroupSave-Admin-/api/accessgroup/save"], "isController": false}, {"data": [0.0, 500, 1500, "IdentityTypeSave-Admin-/api/identitytype/save"], "isController": false}, {"data": [0.0, 500, 1500, "AssetSubTypeSave-Admin-/api/assetsubtype/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/risk/save"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "/api/screencontrolset/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/activity/save"], "isController": false}, {"data": [0.0, 500, 1500, "api/job/save"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "RuleSave-Admin-/api/rule/save?"], "isController": false}, {"data": [0.0, 500, 1500, "AttachmentSave-Admin-/api/attachment/save"], "isController": false}, {"data": [0.0, 500, 1500, "PolicySave-Admin-/api/policy/save?"], "isController": false}, {"data": [0.0, 500, 1500, "Organisation&OrgTypeSave-Admin-/api/organisation/save"], "isController": false}, {"data": [0.0, 500, 1500, "WatchlistSave-Admin-/api/watchlist/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/ruletype/save"], "isController": false}, {"data": [0.0, 500, 1500, "Login-api/auth/token"], "isController": false}, {"data": [0.0, 500, 1500, "RequestTypeSave-Admin-/api/requesttype/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/classdef/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/idm/workschedule/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/provisioninaction/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/policytype/save"], "isController": false}, {"data": [0.0, 500, 1500, "MessageMasterSave-Admin-/api/messagemaster/save"], "isController": false}, {"data": [0.0, 500, 1500, "JobTypeSave-Admin-/api/jobtype/save?"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "SearchLayoutSave-Admin-/api/searchlayout/save"], "isController": false}, {"data": [0.0, 500, 1500, "ReviewTypeSave-Admin-/api/reviewtype/save"], "isController": false}, {"data": [0.0, 500, 1500, "LocationTypeSave-Admin-/api/locationtype/save"], "isController": false}, {"data": [1.0, 500, 1500, "/api/translation/save"], "isController": false}, {"data": [0.0, 500, 1500, "RuleSetSave-Admin-/api/rule-set/save?"], "isController": false}, {"data": [0.0, 500, 1500, "/api/responsecode/save"], "isController": false}, {"data": [0.0, 500, 1500, "/api/configsetting/save"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 325, 313, 96.3076923076923, 110.36615384615384, 15, 12454, 52.0, 117.2000000000001, 150.09999999999997, 1289.3200000000093, 8.247265714213212, 20.89745119839115, 9.90251771576116], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MenuItemSave-Admin-/api/menuitem/save", 5, 5, 100.0, 24.4, 15, 31, 29.0, 31.0, 31.0, 31.0, 39.682539682539684, 161.37307787698413, 43.782552083333336], "isController": false}, {"data": ["/api/analyticsdashboard/save", 7, 7, 100.0, 31.428571428571427, 15, 80, 17.0, 80.0, 80.0, 80.0, 31.11111111111111, 218.58506944444443, 33.71961805555556], "isController": false}, {"data": ["api/legal/agreement/save", 8, 8, 100.0, 44.12500000000001, 29, 78, 37.0, 78.0, 78.0, 78.0, 22.408963585434172, 8.531928396358543, 22.657891281512605], "isController": false}, {"data": ["api/jobtype/save", 2, 1, 50.0, 57.5, 31, 84, 57.5, 84.0, 84.0, 84.0, 17.241379310344826, 12.32489224137931, 21.299164870689655], "isController": false}, {"data": ["AssetSave-Admin-api/asset/save", 5, 5, 100.0, 70.8, 44, 123, 56.0, 123.0, 123.0, 123.0, 13.850415512465373, 5.3589205332409975, 15.03527527700831], "isController": false}, {"data": ["/api/passsecpolicy/save", 7, 7, 100.0, 31.285714285714285, 15, 83, 25.0, 83.0, 83.0, 83.0, 31.25, 220.46770368303572, 34.55897739955357], "isController": false}, {"data": ["api/system/save", 3, 2, 66.66666666666667, 205.0, 29, 536, 50.0, 536.0, 536.0, 536.0, 4.862236628849271, 3.2177496961102108, 5.642536973257698], "isController": false}, {"data": ["/api/mitigationcontrol/save", 3, 3, 100.0, 83.33333333333333, 54, 125, 71.0, 125.0, 125.0, 125.0, 11.952191235059761, 4.567666832669323, 12.263446215139442], "isController": false}, {"data": ["/api/badgedesigner/save", 5, 5, 100.0, 55.4, 30, 96, 46.0, 96.0, 96.0, 96.0, 17.985611510791365, 6.95888601618705, 18.621430980215827], "isController": false}, {"data": ["api/systemtype/save", 2, 2, 100.0, 53.0, 34, 72, 53.0, 72.0, 72.0, 72.0, 18.69158878504673, 7.255768107476635, 21.447867990654206], "isController": false}, {"data": ["AccessSave-Admin-/api/access/save", 3, 3, 100.0, 311.3333333333333, 242, 410, 282.0, 410.0, 410.0, 410.0, 3.205128205128205, 1.2227897970085468, 3.60263922275641], "isController": false}, {"data": ["/api/request/save?", 7, 7, 100.0, 26.71428571428571, 15, 57, 17.0, 57.0, 57.0, 57.0, 36.64921465968586, 337.3435454842932, 43.0761207460733], "isController": false}, {"data": ["/api/recipient/save", 5, 5, 100.0, 49.0, 15, 77, 61.0, 77.0, 77.0, 77.0, 20.242914979757085, 82.96432186234819, 20.57897899797571], "isController": false}, {"data": ["/api/policygroup/save", 4, 4, 100.0, 50.5, 29, 80, 46.5, 80.0, 80.0, 80.0, 19.607843137254903, 7.515701593137256, 19.60305606617647], "isController": false}, {"data": ["/api/adjunctacr/syncrequesttype/save", 4, 4, 100.0, 44.25, 15, 99, 31.5, 99.0, 99.0, 99.0, 22.47191011235955, 60.74986832865169, 24.622542134831463], "isController": false}, {"data": ["/api/responsecodetype/save", 4, 4, 100.0, 49.25, 29, 71, 48.5, 71.0, 71.0, 71.0, 20.0, 7.666015625, 20.1171875], "isController": false}, {"data": ["/api/reconconfig/save", 7, 6, 85.71428571428571, 1805.9999999999998, 18, 12454, 28.0, 12454.0, 12454.0, 12454.0, 0.5535347145342401, 5.300511896054088, 1.0557933338605092], "isController": false}, {"data": ["AccessGroupTypeSave-Admin-/api/accessgrouptype/save", 4, 4, 100.0, 62.0, 43, 88, 58.5, 88.0, 88.0, 88.0, 15.936254980079681, 6.053909362549801, 16.947833665338646], "isController": false}, {"data": ["PreRequisiteSave-Admin-/api/prerequisite/save?", 13, 13, 100.0, 33.76923076923076, 16, 80, 32.0, 67.19999999999999, 80.0, 80.0, 28.88888888888889, 119.46831597222221, 38.56553819444444], "isController": false}, {"data": ["AccessTypeSave-Admin-/api/accesstype/save", 6, 6, 100.0, 79.0, 16, 158, 64.0, 158.0, 158.0, 158.0, 12.526096033402924, 43.250097860125265, 13.34159707724426], "isController": false}, {"data": ["AnalyticsSave-Admin-/api/analytics/save", 26, 26, 100.0, 74.65384615384616, 16, 142, 81.0, 112.80000000000001, 135.7, 142.0, 13.245033112582782, 17.641305559093222, 22.953944854814058], "isController": false}, {"data": ["Organisation&OrgTypeSave-Admin-/api/organisationtype/save?", 4, 4, 100.0, 73.5, 36, 120, 69.0, 120.0, 120.0, 120.0, 13.468013468013467, 5.116266835016836, 14.362373737373739], "isController": false}, {"data": ["WorkflowSave-Admin-/api/workflow/save", 3, 3, 100.0, 65.0, 36, 85, 74.0, 85.0, 85.0, 85.0, 15.228426395939087, 5.770145939086294, 27.586651332487307], "isController": false}, {"data": ["/api/delegation/save", 4, 4, 100.0, 25.75, 15, 57, 15.5, 57.0, 57.0, 57.0, 38.0952380952381, 398.51190476190476, 41.07142857142857], "isController": false}, {"data": ["/api/admin/auth/reset", 2, 1, 50.0, 812.5, 71, 1554, 812.5, 1554.0, 1554.0, 1554.0, 1.2307692307692308, 0.7115384615384616, 1.1754807692307692], "isController": false}, {"data": ["AssetTypeSave-Admin-/api/assettype/save", 6, 6, 100.0, 57.5, 45, 72, 55.5, 72.0, 72.0, 72.0, 17.142857142857142, 33.51283482142858, 19.215959821428573], "isController": false}, {"data": ["ActionSave-Admin-/api/action/save", 2, 1, 50.0, 59.5, 23, 96, 59.5, 96.0, 96.0, 96.0, 16.666666666666668, 88.99739583333334, 19.498697916666668], "isController": false}, {"data": ["MenuItemSave-Admin-/api/menuitem/save---NOTTESTED", 1, 1, 100.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 4.568917410714286, 13.03245907738095], "isController": false}, {"data": ["IdentitySave-Admin-api/identity/save", 4, 4, 100.0, 81.5, 64, 92, 85.0, 92.0, 92.0, 92.0, 12.158054711246201, 4.6987794452887535, 13.196950987841944], "isController": false}, {"data": ["/api/lists/save", 3, 3, 100.0, 49.333333333333336, 30, 73, 45.0, 73.0, 73.0, 73.0, 18.9873417721519, 7.268591772151899, 18.764833860759495], "isController": false}, {"data": ["LocationSave-Admin-/api/location/save", 10, 10, 100.0, 69.5, 33, 97, 70.5, 97.0, 97.0, 97.0, 14.184397163120567, 19.96481604609929, 16.80934175531915], "isController": false}, {"data": ["VisitTypeSave-Admin-/api/tpmadmin/visittype/save", 4, 4, 100.0, 52.75, 17, 82, 56.0, 82.0, 82.0, 82.0, 18.779342723004696, 50.42363556338028, 19.586267605633804], "isController": false}, {"data": ["AccessGroupSave-Admin-/api/accessgroup/save", 19, 19, 100.0, 70.10526315789474, 16, 203, 74.0, 129.0, 203.0, 203.0, 14.115898959881129, 37.81966822994056, 21.337092542719166], "isController": false}, {"data": ["IdentityTypeSave-Admin-/api/identitytype/save", 3, 3, 100.0, 58.666666666666664, 35, 74, 67.0, 74.0, 74.0, 74.0, 16.853932584269664, 6.413491924157304, 17.100816362359552], "isController": false}, {"data": ["AssetSubTypeSave-Admin-/api/assetsubtype/save", 5, 5, 100.0, 55.0, 20, 111, 35.0, 111.0, 111.0, 111.0, 17.921146953405017, 39.85705085125448, 18.992215501792113], "isController": false}, {"data": ["/api/risk/save", 6, 6, 100.0, 44.333333333333336, 15, 110, 31.0, 110.0, 110.0, 110.0, 22.388059701492537, 75.31556086753731, 23.153276585820894], "isController": false}, {"data": ["/api/screencontrolset/save", 7, 6, 85.71428571428571, 54.57142857142857, 31, 109, 42.0, 109.0, 109.0, 109.0, 18.08785529715762, 8.481205587855296, 19.069464631782946], "isController": false}, {"data": ["/api/activity/save", 7, 7, 100.0, 46.85714285714286, 28, 84, 43.0, 84.0, 84.0, 84.0, 21.08433734939759, 8.124294051204819, 22.98745764307229], "isController": false}, {"data": ["api/job/save", 1, 1, 100.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 4.908177759740259, 19.138088474025974], "isController": false}, {"data": ["RuleSave-Admin-/api/rule/save?", 3, 2, 66.66666666666667, 79.0, 44, 114, 79.0, 114.0, 114.0, 114.0, 12.552301255230125, 7.677660826359833, 14.599405073221758], "isController": false}, {"data": ["AttachmentSave-Admin-/api/attachment/save", 2, 2, 100.0, 74.0, 65, 83, 74.0, 83.0, 83.0, 83.0, 13.422818791946309, 5.099098154362417, 16.136220637583893], "isController": false}, {"data": ["PolicySave-Admin-/api/policy/save?", 4, 4, 100.0, 50.25, 27, 84, 45.0, 84.0, 84.0, 84.0, 19.607843137254903, 58.4262025122549, 24.145986519607845], "isController": false}, {"data": ["Organisation&OrgTypeSave-Admin-/api/organisation/save", 5, 5, 100.0, 108.0, 15, 182, 157.0, 182.0, 182.0, 182.0, 9.191176470588236, 20.992503446691174, 10.372386259191176], "isController": false}, {"data": ["WatchlistSave-Admin-/api/watchlist/save", 12, 12, 100.0, 50.0, 19, 71, 51.0, 70.10000000000001, 71.0, 71.0, 19.639934533551553, 37.72791786006547, 22.993172054009822], "isController": false}, {"data": ["/api/ruletype/save", 4, 4, 100.0, 46.75, 29, 80, 39.0, 80.0, 80.0, 80.0, 21.052631578947366, 8.069490131578947, 21.011513157894736], "isController": false}, {"data": ["Login-api/auth/token", 1, 0, 0.0, 1738.0, 1738, 1738, 1738.0, 1738.0, 1738.0, 1738.0, 0.5753739930955121, 28.742852776179518, 0.45007282077100114], "isController": false}, {"data": ["RequestTypeSave-Admin-/api/requesttype/save", 3, 3, 100.0, 55.333333333333336, 33, 87, 46.0, 87.0, 87.0, 87.0, 17.857142857142858, 6.795247395833333, 18.386114211309522], "isController": false}, {"data": ["/api/classdef/save", 8, 8, 100.0, 56.625, 33, 88, 51.0, 88.0, 88.0, 88.0, 17.42919389978214, 8.159296704793029, 19.795070806100217], "isController": false}, {"data": ["/api/idm/workschedule/save", 8, 8, 100.0, 74.62499999999999, 15, 147, 69.0, 147.0, 147.0, 147.0, 13.157894736842104, 71.33082339638158, 14.603464226973685], "isController": false}, {"data": ["/api/provisioninaction/save", 7, 7, 100.0, 84.42857142857143, 65, 138, 68.0, 138.0, 138.0, 138.0, 11.76470588235294, 17.514115021008404, 12.719931722689076], "isController": false}, {"data": ["/api/policytype/save", 4, 4, 100.0, 54.25, 29, 92, 48.0, 92.0, 92.0, 92.0, 18.34862385321101, 7.028562213302752, 18.384461009174313], "isController": false}, {"data": ["MessageMasterSave-Admin-/api/messagemaster/save", 7, 7, 100.0, 47.714285714285715, 33, 81, 43.0, 81.0, 81.0, 81.0, 20.58823529411765, 35.799632352941174, 25.448069852941174], "isController": false}, {"data": ["JobTypeSave-Admin-/api/jobtype/save?", 6, 6, 100.0, 67.5, 36, 89, 69.0, 89.0, 89.0, 89.0, 14.634146341463415, 7.581459603658537, 16.0180068597561], "isController": false}, {"data": ["SearchLayoutSave-Admin-/api/searchlayout/save", 3, 2, 66.66666666666667, 152.33333333333334, 125, 181, 151.0, 181.0, 181.0, 181.0, 6.369426751592357, 3.6740313163481955, 6.811056926751593], "isController": false}, {"data": ["ReviewTypeSave-Admin-/api/reviewtype/save", 7, 7, 100.0, 55.285714285714285, 15, 122, 42.0, 122.0, 122.0, 122.0, 17.857142857142858, 31.790597098214285, 19.553671077806122], "isController": false}, {"data": ["LocationTypeSave-Admin-/api/locationtype/save", 5, 5, 100.0, 54.6, 17, 116, 46.0, 116.0, 116.0, 116.0, 18.050541516245488, 40.31757671480144, 19.125817915162454], "isController": false}, {"data": ["/api/translation/save", 3, 0, 0.0, 131.33333333333334, 79, 227, 88.0, 227.0, 227.0, 227.0, 7.594936708860759, 7.1968947784810124, 7.5875197784810124], "isController": false}, {"data": ["RuleSetSave-Admin-/api/rule-set/save?", 2, 2, 100.0, 68.0, 47, 89, 68.0, 89.0, 89.0, 89.0, 14.598540145985401, 5.567119069343065, 14.92643704379562], "isController": false}, {"data": ["/api/responsecode/save", 3, 3, 100.0, 60.33333333333333, 16, 148, 17.0, 148.0, 148.0, 148.0, 16.393442622950822, 117.27821892076503, 16.17464993169399], "isController": false}, {"data": ["/api/configsetting/save", 7, 7, 100.0, 47.00000000000001, 29, 73, 36.0, 73.0, 73.0, 73.0, 21.021021021021024, 8.07350319069069, 22.20873216966967], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 247, 78.91373801916933, 76.0], "isController": false}, {"data": ["500/Internal Server Error", 66, 21.08626198083067, 20.307692307692307], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 325, 313, "400/Bad Request", 247, "500/Internal Server Error", 66, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["MenuItemSave-Admin-/api/menuitem/save", 5, 5, "400/Bad Request", 3, "500/Internal Server Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/analyticsdashboard/save", 7, 7, "500/Internal Server Error", 5, "400/Bad Request", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["api/legal/agreement/save", 8, 8, "400/Bad Request", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["api/jobtype/save", 2, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["AssetSave-Admin-api/asset/save", 5, 5, "400/Bad Request", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/passsecpolicy/save", 7, 7, "500/Internal Server Error", 5, "400/Bad Request", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["api/system/save", 3, 2, "400/Bad Request", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/mitigationcontrol/save", 3, 3, "400/Bad Request", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/badgedesigner/save", 5, 5, "400/Bad Request", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["api/systemtype/save", 2, 2, "400/Bad Request", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["AccessSave-Admin-/api/access/save", 3, 3, "400/Bad Request", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/request/save?", 7, 7, "500/Internal Server Error", 6, "400/Bad Request", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/recipient/save", 5, 5, "400/Bad Request", 3, "500/Internal Server Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/policygroup/save", 4, 4, "400/Bad Request", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/adjunctacr/syncrequesttype/save", 4, 4, "400/Bad Request", 3, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/responsecodetype/save", 4, 4, "400/Bad Request", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/reconconfig/save", 7, 6, "500/Internal Server Error", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["AccessGroupTypeSave-Admin-/api/accessgrouptype/save", 4, 4, "400/Bad Request", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PreRequisiteSave-Admin-/api/prerequisite/save?", 13, 13, "400/Bad Request", 8, "500/Internal Server Error", 5, "", "", "", "", "", ""], "isController": false}, {"data": ["AccessTypeSave-Admin-/api/accesstype/save", 6, 6, "400/Bad Request", 4, "500/Internal Server Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["AnalyticsSave-Admin-/api/analytics/save", 26, 26, "400/Bad Request", 24, "500/Internal Server Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["Organisation&OrgTypeSave-Admin-/api/organisationtype/save?", 4, 4, "400/Bad Request", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WorkflowSave-Admin-/api/workflow/save", 3, 3, "400/Bad Request", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/delegation/save", 4, 4, "500/Internal Server Error", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/admin/auth/reset", 2, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["AssetTypeSave-Admin-/api/assettype/save", 6, 6, "400/Bad Request", 5, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["ActionSave-Admin-/api/action/save", 2, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MenuItemSave-Admin-/api/menuitem/save---NOTTESTED", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["IdentitySave-Admin-api/identity/save", 4, 4, "400/Bad Request", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/lists/save", 3, 3, "400/Bad Request", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LocationSave-Admin-/api/location/save", 10, 10, "400/Bad Request", 9, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["VisitTypeSave-Admin-/api/tpmadmin/visittype/save", 4, 4, "400/Bad Request", 3, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["AccessGroupSave-Admin-/api/accessgroup/save", 19, 19, "400/Bad Request", 15, "500/Internal Server Error", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["IdentityTypeSave-Admin-/api/identitytype/save", 3, 3, "400/Bad Request", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["AssetSubTypeSave-Admin-/api/assetsubtype/save", 5, 5, "400/Bad Request", 4, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/risk/save", 6, 6, "400/Bad Request", 4, "500/Internal Server Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/screencontrolset/save", 7, 6, "400/Bad Request", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/activity/save", 7, 7, "400/Bad Request", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["api/job/save", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["RuleSave-Admin-/api/rule/save?", 3, 2, "400/Bad Request", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["AttachmentSave-Admin-/api/attachment/save", 2, 2, "400/Bad Request", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PolicySave-Admin-/api/policy/save?", 4, 4, "400/Bad Request", 3, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Organisation&OrgTypeSave-Admin-/api/organisation/save", 5, 5, "400/Bad Request", 4, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WatchlistSave-Admin-/api/watchlist/save", 12, 12, "400/Bad Request", 10, "500/Internal Server Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/ruletype/save", 4, 4, "400/Bad Request", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["RequestTypeSave-Admin-/api/requesttype/save", 3, 3, "400/Bad Request", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/classdef/save", 8, 8, "400/Bad Request", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/idm/workschedule/save", 8, 8, "400/Bad Request", 4, "500/Internal Server Error", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/provisioninaction/save", 7, 7, "400/Bad Request", 6, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/policytype/save", 4, 4, "400/Bad Request", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MessageMasterSave-Admin-/api/messagemaster/save", 7, 7, "400/Bad Request", 6, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["JobTypeSave-Admin-/api/jobtype/save?", 6, 6, "400/Bad Request", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["SearchLayoutSave-Admin-/api/searchlayout/save", 3, 2, "400/Bad Request", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ReviewTypeSave-Admin-/api/reviewtype/save", 7, 7, "400/Bad Request", 6, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["LocationTypeSave-Admin-/api/locationtype/save", 5, 5, "400/Bad Request", 4, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["RuleSetSave-Admin-/api/rule-set/save?", 2, 2, "400/Bad Request", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/responsecode/save", 3, 3, "500/Internal Server Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/configsetting/save", 7, 7, "400/Bad Request", 7, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
