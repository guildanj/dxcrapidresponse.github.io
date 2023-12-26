const API_URL = "https://prod-125.westus.logic.azure.com:443/workflows/a0cde2db054b4a3da2a27c4c68c785e6/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=wz18VmAs1xjBsUOeHxX3YGQdaKCYB6FDbK4uk5YuEQI";
var API_DATE = new Date(2023, 12 - 1, 20);

var CACHED_DATA = {
    "AS-QA": null,
    "EU-QA": null,
    "LA-QA": null,
    "NA-QA": null,
    "AS-PROD": null,
    "EU-PROD": null,
    "LA-PROD": null,
    "NA-PROD": null,
}

var PROCESSING = {
    "AS-QA": false,
    "EU-QA": false,
    "LA-QA": false,
    "NA-QA": false,
    "AS-PROD": false,
    "EU-PROD": false,
    "LA-PROD": false,
    "NA-PROD": false,
}

async function delay(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

function Obj_Initial(id) {
    return `<li id="${id}-item-initial" class="w-full h-[275px] px-4 py-8 flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                    class="w-16 h-16 text-slate-300">
                    <path fill-rule="evenodd"
                        d="M11.622 1.602a.75.75 0 01.756 0l2.25 1.313a.75.75 0 01-.756 1.295L12 3.118 10.128 4.21a.75.75 0 11-.756-1.295l2.25-1.313zM5.898 5.81a.75.75 0 01-.27 1.025l-1.14.665 1.14.665a.75.75 0 11-.756 1.295L3.75 8.806v.944a.75.75 0 01-1.5 0V7.5a.75.75 0 01.372-.648l2.25-1.312a.75.75 0 011.026.27zm12.204 0a.75.75 0 011.026-.27l2.25 1.312a.75.75 0 01.372.648v2.25a.75.75 0 01-1.5 0v-.944l-1.122.654a.75.75 0 11-.756-1.295l1.14-.665-1.14-.665a.75.75 0 01-.27-1.025zm-9 5.25a.75.75 0 011.026-.27L12 11.882l1.872-1.092a.75.75 0 11.756 1.295l-1.878 1.096V15a.75.75 0 01-1.5 0v-1.82l-1.878-1.095a.75.75 0 01-.27-1.025zM3 13.5a.75.75 0 01.75.75v1.82l1.878 1.095a.75.75 0 11-.756 1.295l-2.25-1.312a.75.75 0 01-.372-.648v-2.25A.75.75 0 013 13.5zm18 0a.75.75 0 01.75.75v2.25a.75.75 0 01-.372.648l-2.25 1.312a.75.75 0 11-.756-1.295l1.878-1.096V14.25a.75.75 0 01.75-.75zm-9 5.25a.75.75 0 01.75.75v.944l1.122-.654a.75.75 0 11.756 1.295l-2.25 1.313a.75.75 0 01-.756 0l-2.25-1.313a.75.75 0 11.756-1.295l1.122.654V19.5a.75.75 0 01.75-.75z"
                        clip-rule="evenodd" />
                </svg>
                <h1 class="text-sm text-slate-600 mt-2">Please wait while we initialize the page</h1>
            </li>`;
}

function Obj_Loading(id) {
    return `<li id="${id}-item-loading" class="w-full px-4 py-8 flex flex-col items-center justify-center text-center">
                <div class="loadingio-spinner-ripple-8427tzy5h9o">
                    <div class="ldio-l0r84xjq5zo">
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </li>`;
}

function Obj_Error(id) {
    return `<li id="${id}-item-error" class="w-full h-[275px] px-4 py-8 flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                    class="w-16 h-16 text-slate-300">
                    <path fill-rule="evenodd"
                        d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                        clip-rule="evenodd" />
                </svg>
                <h1 class="font-semibold text-md">Please try again!</h1>
                <p class="text-xs text-slate-400">Unable to fetch data from RapidResponse. You can click <a
                        href="#" class="font-semibold">here</a> to view what went wrong.</p>
            </li>`;
}

function Obj_Empty(id) {
    return `<li id="${id}" class="w-full h-[275px] px-4 py-8 flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                    class="w-16 h-16 text-slate-300">
                    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm-4.34 7.964a.75.75 0 01-1.061-1.06 5.236 5.236 0 013.73-1.538 5.236 5.236 0 013.695 1.538.75.75 0 11-1.061 1.06 3.736 3.736 0 00-2.639-1.098 3.736 3.736 0 00-2.664 1.098z" clip-rule="evenodd" />
                </svg>
                  
                <h1 class="font-semibold text-md">Please try again!</h1>
                <p class="text-xs text-slate-400">No data to be shown. It looks like the server returned an empty response.</p>
            </li>`;
}



function InitializeViews() {
    lists = [
        "AS-QA",
        "EU-QA",
        "LA-QA",
        "NA-QA",
        "AS-PROD",
        "EU-PROD",
        "LA-PROD",
        "NA-PROD",
    ];

    lists.forEach(e => {
        const tagList = '#' + e + "-list";
        $(tagList).empty();
        $(tagList).append(Obj_Initial(e));
    });
}

async function GetReport(reg, env, sys, sdate) {
    var Source = null;

    const regionEnv = {
        "Asia": ["AS-QA", "AS-PROD"],
        "Europe": ["EU-QA", "EU-PROD"],
        "LatinAmerica": ["LA-QA", "LA-PROD"],
        "NorthAmerica": ["NA-QA", "NA-PROD"],
    }

    var htmlTags = {};
    var regTags = {};
    reg.forEach((e) => {
        var tag = regionEnv[e][env];

        if (PROCESSING[tag] == false) {
            regTags[e] = getRegionCurrentDate(e, sdate);
            htmlTags[e] = tag;
            PROCESSING[tag] = true;
        }
    });

    if (sys == "LAAS-QA") {
        Source = {
            "URL_DIS": "https://na1.kinaxis.net/PNGT10_QA3_DIS",
            "URL_PS": "https://na1.kinaxis.net/PNGT11_QA3",
            "Auth_DIS": "Basic OTgwZDQzOTA5MmVmNWNlOTc1MjhjMjliMmQxMTU1OWQ6YTE1YWFiMzgwNjE0ZjUzZjkzY2I4NjMyYzliN2FlY2QzOWI1NGI3OGVkYTk5YWNlNjBlNDdjN2VkNWU0NjU1ZQ==",
            "Auth_PS": "Basic ZTAxMTkwMWY5N2EwMmFlOGZkNzgxNWY2MDUzZTYyNmM6ZGI2MzllYWY3MjBmY2ExNDE4ZDg5ZWNkYzJlZGQ2YzQ0N2FlNjIzZjVhMDhiZDNmNzkyNWNlOTEzZmZlZTI5NA==",
            "HtmlTags": htmlTags,
            "RegionTags": JSON.stringify(regTags),
        };
    } else if (sys == "NAEU-QA") {
        Source = {
            "URL_DIS": "https://na1.kinaxis.net/PNGT07_QA2_DIS",
            "URL_PS": "https://na1.kinaxis.net/PNGT08_QA2",
            "Auth_DIS": "",
            "Auth_PS": "",
            "HtmlTags": htmlTags,
            "RegionTags": JSON.stringify(regTags),
        };
    } else if (sys == "LAAS-PROD") {
        Source = {
            "URL_DIS": "https://na2.kinaxis.net/PNGP07_PRD3_DIS",
            "URL_PS": "https://na2.kinaxis.net/PNGP08_PRD3",
            "Auth_DIS": "",
            "Auth_PS": "",
            "HtmlTags": htmlTags,
            "RegionTags": JSON.stringify(regTags),
        };
    } else if (sys == "EU-PROD") {
        Source = {
            "URL_DIS": "https://na2.kinaxis.net/PNGP04_PRD2_DIS",
            "URL_PS": "https://na2.kinaxis.net/PNGP05_PRD2",
            "Auth_DIS": "",
            "Auth_PS": "",
            "HtmlTags": htmlTags,
            "RegionTags": JSON.stringify(regTags),
        };
    } else if (sys == "NA-PROD") {
        Source = {
            "URL_DIS": "https://na2.kinaxis.net/PNGP01_PRD_DIS",
            "URL_PS": "https://na2.kinaxis.net/PNGP02_PRD",
            "Auth_DIS": "",
            "Auth_PS": "",
            "HtmlTags": htmlTags,
            "RegionTags": JSON.stringify(regTags),
        };
    }

    if (Source != null) {

        // Check if the selected system is already being processed, skip if yes.
        if (Object.keys(Source.HtmlTags).length > 0) {

            for (var tag in Source.HtmlTags) {
                const tagList = '#' + Source.HtmlTags[tag] + "-list";
                $(tagList).empty();
                $(tagList).append(Obj_Loading(tag));
            };


            await delay(500);

            const taskDIS = new Promise(
                (resolve) => SendRequest(
                    Source.URL_DIS,
                    Source.Auth_DIS,
                    Source.RegionTags,
                    "POST",
                    function (json) {
                        resolve(json);
                    },
                    function (error) {
                        resolve({
                            "Status": false,
                            "Value": error,
                        });
                    }
                ));

            var results = await Promise.all([
                taskDIS,
            ]);


            var resultDIS = results[0];

            if (resultDIS.Status) {
                var DataDIS = JSON.parse(resultDIS.Response.Value);
                console.log(DataDIS);

                for (var region in JSON.parse(Source.RegionTags)) {
                    const tag = Source.HtmlTags[region];
                    const tagList = '#' + tag + "-list";
                    $(tagList).empty();

                    for (var ETLName in DataDIS[region]) {

                        var ETL = DataDIS[region][ETLName];
                        const labelName = ETL.Label;
                        const labelEnabled = ETL.Enabled;
                        const labelSchedule = ETL.ScheduleStart;
                        const labelStatus = ETL.Status;
                        const colorBackground = GetStatusBackgroundColor(labelStatus);

                        var forecolor = "text-black";
                        var infocolor = "text-gray-500";
                        var enabledcolor = "bg-black";

                        if (colorBackground != "bg-white") {
                            forecolor = "text-white";
                            infocolor = "text-gray-50";
                        }

                        if (labelEnabled.startsWith("Disabled")) enabledcolor = "bg-red-500";
                        else if (labelEnabled == "Enabled") enabledcolor = "bg-green-500";
                        else enabledcolor = "bg-orange-500";

                        $(tagList).append(
                            `<li class="relative w-full p-2 border border-slate-200 rounded-lg ${forecolor} ${colorBackground}">
                            <div class="w-full flex flex-row items-center justify-between">
                                <p class="line-clamp-1 text-sm font-semibold">${labelName}</p>
                                <div class="flex flex-row items-center bg-white border border-slate-300 shadow-sm px-1 rounded-md align-middle">
                                    <div class="w-[5px] h-[5px] rounded-full mr-1 ${enabledcolor}"></div>
                                    <p class="text-[10px] text-black">${labelEnabled}</p>
                                </div>
                            </div>
                            <p class="text-[9px] line-clamp-1 ${infocolor}">${labelSchedule}</p>

                            <p class="text-xs line-clamp-1 mt-1 font-semibold">DIS Status: <span class="${infocolor} font-normal">${labelStatus}</span></p>
                            <p class="text-xs line-clamp-1 font-semibold">PS Status: <span class="${infocolor} font-normal">${labelStatus}</span></p>
                            <a href="#"
                                class="absolute z-10 top-0 bottom-0 right-0 left-0 rounded-lg hover:bg-slate-300 hover:bg-opacity-20"></a>
                        </li>`
                        );
                    }

                    if ($(tagList + ' > li').length == 0) {
                        // Show Empty
                        $(tagList).append(Obj_Empty(tag));
                    }

                };
            }

            if (!resultDIS.Status) { // if (!resultDIS.Status && !resultPS.Status) {
                for (var tag in Source.HtmlTags) {
                    const tagList = '#' + Source.HtmlTags[tag] + "-list";

                    $(tagList).empty();
                    $(tagList).append(Obj_Error(tag));
                };
            }

            for (var tag in Source.HtmlTags) {
                PROCESSING[Source.HtmlTags[tag]] = false;
            };
        }
    } else {
        alert('Incorrect Parameters for Getting Report.');
    }
}

async function SendRequest(url, auth, data, method, successCallback, errorCallback) {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    const body = JSON.stringify({
        "url": url,
        "authorization": auth,
        "body": "grant_type=client_credentials",
        "data": data
    });

    const requestOptions = {
        method: method,
        headers: headers,
        body: body,
        redirect: 'follow'
    };

    fetch(API_URL, requestOptions)
        .then(response => response.text())
        .then(result => {
            const json = JSON.parse(result);
            successCallback(json);
        })
        .catch(error => errorCallback(error));
}

function GetStatusBackgroundColor(status) {
    const backgroundColors = {
        "Waiting For Files": "bg-yellow-500",
        "Running": "bg-yellow-500",
        "Importing": "bg-yellow-500",
        "Transforming": "bg-yellow-500",
        "Extracting": "bg-yellow-500",
        "Checking Import": "bg-yellow-500",
        "Recovering": "bg-yellow-500",
        "Recovering (Incomplete)": "bg-yellow-500",
        "Partially Recovered": "bg-orange-500",
        "Completed": "bg-emerald-500",
        "Completed (Recovery)": "bg-emerald-500",
        "Incomplete": "bg-orange-500",
        "Failed": "bg-red-500",
        "Expired": "bg-red-500",
    };

    return backgroundColors[status] ?? "bg-white";
}

function ParseDateToString(date) {
    var m = (date.getMonth() + 1).toString().padStart(2, '0');
    var d = date.getDate().toString().padStart(2, '0');
    var y = date.getFullYear().toString().substring(2);

    return `${m}-${d}-${y}`;
}

function getRegionCurrentDate(region, day) {

    var actualDate = new Date();

    if (region == "Asia") {
        if (actualDate.getHours() >= 18) {
            // Current Date is Next Day
            actualDate.setDate(actualDate.getDate() + 1);
        }
    } else if (region == "NorthAmerica" || region == "LatinAmerica") {
        if (actualDate.getHours() < 6) {
            // Current Date is Previous Day
            actualDate.setDate(actualDate.getDate() + -1);
        }
    }

    // Offset
    if (day > 0) {
        actualDate.setDate(actualDate.getDate() + day);
    }

    return ParseDateToString(actualDate);
}